function main()
{
    var engine = new EngineCore(60);
    engine.Init();
    engine.Run();
}

onload = main;