#This file sets up numerous auto compilers for less files.
cd /home/ubuntu/workspace
node less-watch-compiler.js resources resources &
node less-watch-compiler.js custom/windows custom/windows &
node less-watch-compiler.js custom/AGOL custom/AGOL &
node less-watch-compiler.js custom/overview custom/overview &