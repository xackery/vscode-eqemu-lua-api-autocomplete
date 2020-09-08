package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/xackery/log"
)

var (
	completionItems       []CompletionItem
	currentCompletionItem *CompletionItem
)

// CompletionItem represents a ts completion item
type CompletionItem struct {
	Name        string
	Description string
	Type        string
	Properties  []Property
}

// LowerName lowers a namer to lowercase
func (c *CompletionItem) LowerName() string {
	return strings.ToLower(c.Name)
}

// VariableName returns a variable-friendly version of a name
func (c *CompletionItem) VariableName() string {
	return strings.ReplaceAll(c.Name, "_", "")
}

// Property are within a completionitem
type Property struct {
	Name        string
	Type        string
	Description string
	Syntax      string
}

// VariableName returns a variable-friendly version of a name
func (p *Property) VariableName() string {
	return strings.ReplaceAll(p.Name, "_", "")
}

// LowerName lowercases a name
func (p *Property) LowerName() string {
	return strings.ToLower(p.Name)
}

func main() {
	log := log.New()
	err := run()
	if err != nil {
		log.Error().Err(err).Msg("failed")
		os.Exit(1)
	}
	log.Info().Msg("completed")
}

func run() error {
	if len(os.Args) < 2 {
		fmt.Println("syntax: scraper <eqquestapi-path>")
		os.Exit(1)
	}

	err := filepath.Walk(os.Args[1], scrape)
	if err != nil {
		return fmt.Errorf("walk: %w", err)
	}

	path := "../../src/extension.ts"
	f, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("create %s: %w", path, err)
	}
	defer f.Close()

	path = "./extensions_template.txt"
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return fmt.Errorf("readFile %s: %w", path, err)
	}
	tmpl, err := template.New("root").Parse(string(data))
	if err != nil {
		return fmt.Errorf("parse %s: %w", path, err)
	}
	err = tmpl.Execute(f, struct {
		CompletionItems []CompletionItem
	}{
		completionItems,
	})
	if err != nil {
		return fmt.Errorf("execute: %w", err)
	}

	return nil
}

func scrape(path string, info os.FileInfo, err error) error {
	if err != nil {
		return fmt.Errorf("walk %q: %w", path, err)
	}

	if info.IsDir() {
		if currentCompletionItem != nil && len(currentCompletionItem.Properties) > 0 {
			completionItems = append(completionItems, *currentCompletionItem)
		}
		currentCompletionItem = &CompletionItem{
			Name: info.Name(),
		}
		fmt.Println(currentCompletionItem.Name)
		return nil
	}

	// only parse markdown files
	if strings.ToLower(filepath.Ext(path)) != ".md" {
		return nil
	}

	f, err := os.Open(path)
	if err != nil {
		return fmt.Errorf("open md: %w", err)
	}

	data, err := ioutil.ReadAll(f)
	if err != nil {
		return fmt.Errorf("read data: %w", err)
	}
	f.Close()

	isMarkdown := false
	lines := strings.Split(string(data), "\n")

	prop := Property{}
	isDocs := false
	for _, line := range lines {
		if !isMarkdown && strings.TrimSpace(line) == "---" {
			isMarkdown = true
			continue
		}
		if isMarkdown && strings.TrimSpace(line) == "---" {
			break
		}
		if !strings.Contains(line, ":") {
			continue
		}
		key := line[0:strings.Index(line, ":")]
		value := strings.TrimSpace(line[len(key)+1:])

		if strings.Contains(path, "_index") {
			switch key {
			case "searchTitle":
				currentCompletionItem.Type = value[strings.LastIndex(value, " ")+1:]
			case "description":
				currentCompletionItem.Description = value
			}
			continue
		}

		switch key {
		case "searchTitle":
			prop.Name = value[strings.LastIndex(value, " ")+1:]
			if currentCompletionItem.Type == "Enum" {
				prop.Type = "Property"
			}
		case "function":
			prop.Name = value
			prop.Type = "Method"
		case "property":
			prop.Name = value
			prop.Type = "Property"
		case "description":
			if !isDocs {
				prop.Description = value
			}
		case "docs":
			isDocs = true
			prop.Description = value
		}
	}
	if prop.Name != "" {
		prop.Name = strings.TrimSpace(prop.Name)
		if prop.Type == "" {
			prop.Type = "Method"
		}
		currentCompletionItem.Properties = append(currentCompletionItem.Properties, prop)
	}

	return nil
}
