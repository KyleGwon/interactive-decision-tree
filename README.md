# interactive-decision-tree
An interactive decision tree created over the summer of 2023 for use by Franklin Templeton Investments

This website needs to use a web server in order to utilize **d3.js**. There are steps below on how to run the program.

Steps to Run:
1. Install Python and pip.
   Go to [www.python.org ](www.python.org) and download Python. The latest version is recommended, as only Python 3.4 and onward include pip in installation. Earlier versions require separate installation of pip.
2. Download **interactive-decision-tree**.
3. Open command prompt.
4. Install the **live-server** package using pip.
```
pip install live-server
```
5. Locate **interactive-decision-tree** within your files.
6. Navigate to the **interactive-decision-tree** directory using command prompt. You can use [this guide](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/) to help navigate command prompt.
7. Run the **live-server** package inside of the **interactive-decision-tree** directory.
```
live-server
```
Command prompt will then display the message
```
Serving "[Your Path Here]\interactive-decision-tree" at http://127.0.0.1:8080
Ready for changes
```
and proceed to use port 8080 (default port) to run the server. To close this server, you can either close the terminal or press Ctrl + C, where command prompt will ask you 
```
Terminate batch job (Y/N)?
```
where you can then enter "Y" to successfully close the server.
