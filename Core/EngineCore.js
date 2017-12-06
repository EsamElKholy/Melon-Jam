var EngineCore = function (fps)
{
    var Delta = 1.0 / fps;
    var MainLoopTimerID;
    var CanvasManager;

    this.Init = function ()
    {
        CanvasManager = new canvas(document.getElementById("canvas"));
        CanvasManager.init();
        CanvasManager.setClearColor(0, 0, 0, 1);
        InputManager("canvas");
        runInputManager();
    }

    this.Run = function ()
    {
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
    }

    var MainLoop = function ()
    {
        CanvasManager.clear("default");
        MainLoopTimerID = requestAnimationFrame(MainLoop, Delta);
    }

    var Stop = function ()
    {
        cancelAnimationFrame(MainLoopTimerID);
    }
}