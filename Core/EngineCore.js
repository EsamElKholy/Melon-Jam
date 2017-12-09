var EngineCore = function (fps)
{
    var Delta = 1.0 / fps;
    var MainLoopTimerID;

    this.Init = function ()
    {
        InputManager("canvas");
        runInputManager();
    }

    this.Run = function ()
    {
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
    }

    var MainLoop = function ()
    {
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
    }

    var Stop = function ()
    {
        cancelAnimationFrame(MainLoopTimerID);
    }
}