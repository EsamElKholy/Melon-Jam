var Transform = function (pos, rot, scale)
{
    this.Position = pos || new Vec3();
    this.Rotation = rot || new Quaternion();
    this.Scale = scale || new Vec3();
}