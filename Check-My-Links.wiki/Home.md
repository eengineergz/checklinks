## About
Check My Links is an extension developed primarily for web designers, developers and content editors that crawls through your webpages looking for broken links and identifying them for you.

## Using the extension
To use the extension:

1. Browse to the page you want to check
2. Click on the 'Check My Links' button in the Chrome toolbar
3. The extension will then find all of the links on a web page, and check each one for you. Broken links will be shown on the page highlighted in red with the server response code next to the link (404, 500 etc).

## Nofollow
Check My Links will not check links with a link relation attribute of 'nofollow', you should apply this attribute to links you don't want 'clicked' (such as Log Out, Sign Out links etc) eg.

`<a href="http://mydomain.com/logout" rel="nofollow">Logout</a>`

## Advanced
HTTP response codes and the full URLs of broken links are published in the Console log (Found in: 'Chrome > Tools > Javascript Console' or Ctrl+Shift+J). 

## Ads and excluding URLs/domains
'Check My Links' initially considered all links equal, and checked them all regardless of which domain they were pointing to. However, some users have asked for the extension to skip Google Adsense links (for obvious reasons). I've since added a few domains to an internal blacklist which the extension will use to skip these links, this list includes:

* googleleads.g.doubleclick.net
* doubleclick.net
* googleadservices.com
* googlesyndication.com
* adservices.google.com
* appliedsemantics.com

To add your own URLs or domains to the exclusion list, look at the options page for the extension. 

How to view the extension options:

1. Go to: chrome://settings/extensions
2. Click on the 'options' link listed under the 'Check My Links' extension

## Issues

If you have any problems with the extension, please add them to the issues list:

https://github.com/PageModifiedOfficial/Check-My-Links/issues

Comments and feedback are welcome both here and directly at support@pagemodified.com.

Thanks!
