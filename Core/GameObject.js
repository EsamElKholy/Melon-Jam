var GameObject = function(name, transform)
{
    this.Name = name;
    this.Transform = transform || new Transform();
    var Children = [];
    var Components = [];

    this.AddChild = function (child)
    {
        Children.push(child);
    }
}