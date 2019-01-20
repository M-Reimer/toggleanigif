# -*- Mode: Makefile -*-
#
# Makefile for Toggle AniGif
#

FILES = manifest.json \
        background.js \
        $(wildcard _locales/*/messages.json) \
        $(wildcard icons/*.svg)

toggleanigif-trunk.xpi: $(FILES) icons/toggleanigif-light.svg
	@zip -9 - $^ > $@

icons/toggleanigif-light.svg: icons/toggleanigif.svg
	@sed 's/:#0c0c0d/:#f9f9fa/g' $^ > $@

clean:
	rm -f toggleanigif-trunk.xpi
	rm -f icons/toggleanigif-light.svg
