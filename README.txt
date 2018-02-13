QANTOR PREREQUISITES
--------------------
    1. Microsoft Visual Studio 2017
    2. Microsoft .NET Core 2.0 Runtime & SDK (preinstalled with VS)
    3. SQL Server 2016 (any edition)
    4. NodeJS with NPM 5.5.1+
    5. Google Chrome 62+

BUILDING SOLUTION
-----------------
    1. Run "npm install" from command line at "/src/Qantor".
    2. Open "/src/Qantor.sln".
    3. Expand the "IIS Express" dropdown and set "Web Browser" to "Google Chrome".
    4. Ensure that "Qantor" is set as startup project.
    5. Press F5 to build and run the application.

DATABASE PUBLISH
----------------
    1. Go to "Package Manager Console".
    2. Ensure that current user can connect to SQL Server through Windows Authentication.
    3. Ensure that "Default project" is set to "Qantor" (in the Package Manager Console tab).
    4. Run "Update-Database".
    5. Build and run the Qantor application which will automatically fill the database with sample data.

DEVELOPING JS (CLIENT-SIDE)
---------------------------
    1. Ensure that the current user has priviledge to run PowerShell scripts.
    2. Build and run VS solution.
    3. Run "/src/Qantor/Qantor.Watch.ps1".
    
    After changing any JS file, review compilation errors in the PowerShell console.
    Debugging is possible via Google Chrome's developer tools. Original source files
    are registered using "webpack://" protocol and have paths of the form
    "webpack://./Client/*".
