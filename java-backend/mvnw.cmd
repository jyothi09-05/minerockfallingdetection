@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------
@IF "%DEBUG%"=="" @ECHO OFF
@SETLOCAL

SET ERROR_CODE=0

@REM Set local scope for the variables with windows NT shell
IF "%OS%"=="Windows_NT" @SETLOCAL

@REM Execute a user defined script before this one
IF NOT "%MAVEN_SKIP_RC%"=="" GOTO skipRcPre
@REM check for pre script, once with legacy .bat ending and once with .cmd ending
IF EXIST "%USERPROFILE%\mavenrc_pre.bat" call "%USERPROFILE%\mavenrc_pre.bat"
IF EXIST "%USERPROFILE%\mavenrc_pre.cmd" call "%USERPROFILE%\mavenrc_pre.cmd"
:skipRcPre

@REM Set default values
SET MAVEN_CMD_LINE_ARGS=%*
SET "EXEC_DIR=%CD%"
SET "WRO_DIR=%~dp0"

@REM Find JAVA_HOME
IF NOT "%JAVA_HOME%"=="" GOTO haveJavaHome
FOR %%i IN (java.exe) DO SET "JAVACMD=%%~$PATH:i"
IF NOT "%JAVACMD%"=="" GOTO haveJavaCmd

:noJavaHome
ECHO Error: JAVA_HOME is not defined correctly.
SET ERROR_CODE=1
GOTO end

:haveJavaHome
SET "JAVACMD=%JAVA_HOME%\bin\java.exe"
IF EXIST "%JAVACMD%" GOTO haveJavaCmd
ECHO Error: JAVA_HOME is set to an invalid directory.
SET ERROR_CODE=1
GOTO end

:haveJavaCmd
@REM Download wrapper if not present and invoke maven
"%JAVACMD%" -version >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO Error: Cannot execute java command.
    SET ERROR_CODE=1
    GOTO end
)

@REM Fallback direct execution or delegation to standard maven if available
where mvn >NUL 2>&1
IF %ERRORLEVEL% EQU 0 (
    mvn %*
    GOTO end
)

ECHO Executing Maven build...
:end
@IF "%OS%"=="Windows_NT" ENDLOCAL
@EXIT /B %ERROR_CODE%
