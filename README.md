Add extension to vscode by choosing install from VSIX

install the verb from 293.html.moo onto an object using the :html name.
Your MOO server needs to have the $http package.
In the spirit of open source, there is no API key required (but you can always add one yourself)

Control-shift-p MOO: Get Verb
enter obj:verbname

make sure you omit the # from the object dbref.

You will need to create a script for your favourite client to import the saved code to your MOO.

This is an example of what I use in MUSHClient which was authored by Krenath




```
function Outgoing()
    local filePath = "D:\\source\\Outgoing\\outgoing.moo"
	local f = io.open(filePath, "r")
	if f then
		local contents = f:read("*a")
		f:close()
         
		-- Send the file contents to the world
		Send(contents)
          
		-- Delete the file after its contents have been sent
		os.remove(filePath)
	end
end
```
