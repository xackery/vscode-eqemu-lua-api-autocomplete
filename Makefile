.PHONY: package
package:
	@nvm use
	@vcse package
.PHONY: deploy
deploy: package
	@nvm use
	@vcse publish
