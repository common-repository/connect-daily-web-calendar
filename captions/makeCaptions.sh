#!/bin/sh
######################################################################
#
#	This script generates a .pot file for translation using the
#	WordPress tools. Then, it calls some Connect Daily code to
#	use Connect Daily's existing translations and put what we
#	already have into the individual translation (.po) files.
#
#	Finally, it calls msgfmt to convert the .po files to .mo files.
#
#	See Also: README
#
######################################################################
rm *.po *.mo *.pot *.json
WPDIR=/home/gsexton/public_html
CDAILYDIR=/home/gsexton/cdaily
LIBDIR=$CDAILYDIR/AddlJars
CAPTIONDIR=$CDAILYDIR/WEB-INF/classes
POTFILE=`pwd`/connect-daily-web-calendar.pot
MAKEPOT=/usr/local/bin/wp-cli.phar
MAKEPOT=~/CDailyWordPressPlugin/wp-cli/bin/wp
#MAKEPOT=~/CDailyWordPressPlugin/wp-cli.phar
if [ ! -f $MAKEPOT ]; then
	echo -e "\nError: $MAKEPOT not found. Find $MAKEPOT and re-execute this script.\n\n"
	exit 1
fi
#
#	Generate the POT file.
#
$MAKEPOT i18n make-pot .. $POTFILE --path=$WPDIR --domain=connect-daily-web-calendar --include=blocks/gblock,*.php --ignore-domain
#
#	create the PO files using our existing caption bundles.
#
java -classpath $LIBDIR/MHS.jar:$LIBDIR/htmlparser.jar:$LIBDIR/cdaily.jar \
	com.mhsoftware.cdaily.support.i18n.WordPressConverter \
	--potfile=$POTFILE \
	--ConnectDailyDirectory=$CAPTIONDIR
#
#	Generate the .MO files.
#
export PATH=~/po2json/bin:$PATH
for file in *.po; do
	msgfmt -o ${file/.po/.mo} $file 
	po2json ${file} ${file/.po/-connect-daily-web-calendar-gblock-editor.json} -f jed
done
