var InputManager = function(idName)
{
	InputManager.idName = idName;
	InputManager.mouseUp = [0, 1, 2];
    InputManager.mouseDown = [0, 1, 2];

	InputManager.keyUp = {};
    InputManager.keyDown = {};

	InputManager.mousePos = [0, 0];
    InputManager.mousePosNDC = [0, 0];
	InputManager.mouseWheel = [0, 0, 0];
	InputManager.mousePosOffset = [0, 0, 0];
	InputManager.mouseMoved = false;
    InputManager.firstMouse = true;

    InputManager.addKeyboardKey = function(key)
	{
        InputManager.keyUp[key] = false;
        InputManager.keyDown[key] = false;
	}

    InputManager.isKeyUp = function(name)
	{
        var state = InputManager.keyUp[name];

        InputManager.keyUp[name] = false;

		return state;	
	}

    InputManager.isKeyDown = function(name)
	{
        return InputManager.keyDown[name];	
	}

    InputManager.isButtonUp = function(code)
	{
        var state = InputManager.mouseUp[code];

        InputManager.mouseUp[code] = false;

		return state;	
	}

    InputManager.isButtonDown = function(code)
	{
        return InputManager.mouseDown[code];	
	}

    InputManager.getMouseWheel = function()
	{
        return [InputManager.mouseWheel[0], InputManager.mouseWheel[1], InputManager.mouseWheel[2]];
	}

    InputManager.getMousePos = function()
	{
		var c = document.getElementById(InputManager.idName);
		var x = InputManager.mousePos[0] - c.clientWidth / 2.0;
		var y = c.clientHeight / 2.0 - InputManager.mousePos[1];
        return [x, y];
	}	
}

function keyDownEvent(e)
{
    InputManager.keyDown[e.code] = true;
    InputManager.keyUp[e.code] = false;
}

function keyUpEvent(e)
{
    InputManager.keyDown[e.code] = false;
    InputManager.keyUp[e.code] = true;
}

function mouseDownEvent(e)
{
    InputManager.mouseDown[e.button] = true;
    InputManager.mouseUp[e.button] = false;
}

function mouseUpEvent(e)
{
    InputManager.mouseDown[e.button] = false;
    InputManager.mouseUp[e.button] = true;
}

function mouseMoveEvent(e)
{
    if (InputManager.firstMouse) 
	{
        InputManager.mousePos[0] = e.clientX;
        InputManager.mousePos[1] = e.clientY;

        InputManager.firstMouse = false;
	}

    InputManager.mousePosOffset[0] = e.clientX - InputManager.mousePos[0];
    InputManager.mousePosOffset[1] = InputManager.mousePos[1] - e.clientY;
    InputManager.mousePosOffset[2] = e.timeStamp;

	InputManager.mousePos[0] = e.clientX;
    InputManager.mousePos[1] = e.clientY;
}

function wheelEvent(e)
{
	InputManager.mouseWheel[0] = e.deltaX;
	InputManager.mouseWheel[1] = e.deltaY;
    InputManager.mouseWheel[2] = e.timeStamp;
}

function runInputManager()
{
	for (var i = 0; i < 3; i++)
	{
		InputManager.mouseDown[i] = false;	
        InputManager.mouseUp[i] = false;	
	}

	document.addEventListener("keydown", keyDownEvent);

	document.addEventListener("keyup", keyUpEvent);

    document.getElementById(InputManager.idName).addEventListener("mousedown", mouseDownEvent);

    document.getElementById(InputManager.idName).addEventListener("mouseup", mouseUpEvent);

    document.getElementById(InputManager.idName).addEventListener("wheel", wheelEvent);

    document.getElementById(InputManager.idName).addEventListener("mousemove", mouseMoveEvent);
}