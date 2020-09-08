.PHONY: package
package:
	@nvm use
	@npm install -g vsce
	@vcse package
.PHONY: deploy
deploy: package
	@nvm use
	@vcse publish
