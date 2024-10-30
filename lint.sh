#!/bin/sh
#######################################################
#
# This script compiles any found php files, checking
# for syntax errors.
#
#######################################################
# The path to the directory containing the PHP CLI
BINDIR=/usr/bin
$BINDIR/php -v
find . -type f -name "*.php" ! -path "./releases/*" -exec $BINDIR/php -lf "{}" \;
