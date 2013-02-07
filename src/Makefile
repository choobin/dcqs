ZIP=$(shell which zip)

all: clean
	$(ZIP) dcqs@moongiraffe.net.xpi bootstrap.js install.rdf options.xul ../ChangeLog ../LICENSE ../README

clean:
	-$(RM) *.xpi > /dev/null 2>&1

.PHONY: all clean
