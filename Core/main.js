function main()
{
    var engine = new EngineCore(800, 600, 60);
    engine.Init();
    engine.Run();
}

onload = main;