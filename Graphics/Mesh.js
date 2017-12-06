var Vertex = function (pos, norm, tex)
{
    this.Position = pos;
    this.Normal = norm;
    this.TexCoords = tex;
}

var Buffers = function ()
{
    this.BindBuffers = function ()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);

        if (this.withTexture) 
        {
            gl.enableVertexAttribArray(2);

            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * 4, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
            gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
        }
        else
        {
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        }		
    }

    this.UnbindBuffers = function ()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    this.DrawVertices = function ()
    {
        BindBuffers();

        if (PrimitiveType === gl.LINES)
        {
            gl.LineWidth(LineWidth);
        }

        gl.DrawArrays(PrimitiveType, 0, VertexCount);

        if (PrimitiveType === gl.LINES)
        {
            gl.LineWidth(1.0);
        }

        UnbindBuffer();
    }

    this.Destroy = function ()
    {
        gl.deleteBuffer(VBO);
        VBO = 0;
    }

    var VBO;
    var PrimitiveType;
    var VertexCount;
    var LineWidth;
}

var Mesh = function ()
{
    this.GetMinBounds = function ()
    {
        return MinBounds;
    }

    this.GetMaxBounds = function ()
    {
        return MaxBounds;
    }

    this.GetSize = function ()
    {
        return Size;
    }

    this.GetVertexCount = function ()
    {
        return MeshBuffers.GetVertexCount();
    }

    this.SetVertexCount = function (vertCount) { MeshBuffers.SetVertexCount(vertCount); }

    this.GetBuffers = function () { return MeshBuffers; }
    this.SetBuffers = function (buffers) { MeshBuffers = buffers; }

    this.CalculateBounds = function ()
    {
        var min = new vector3(999999999.0, 999999999.0, 999999999.0);
        var max = new vector3(-999999999.0, -999999999.0, -999999999.0);

        var vertices = MeshBuffers.OpenVertexBuffer();

        for (let i = 0; i < MeshBuffers.GetVertexCount(); i++)
        {
            var pos = vertices[i].Position;

            if (pos.x < min.x)
            {
                min.x = pos.x;
            }

            if (pos.y < min.y)
            {
                min.y = pos.y;
            }

            if (pos.z < min.z)
            {
                min.z = pos.z;
            }

            if (pos.x > max.x)
            {
                max.x = pos.x;
            }

            if (pos.y > max.y)
            {
                max.y = pos.y;
            }

            if (pos.z > max.z)
            {
                max.z = pos.z;
            }
        }

        MinBounds = min;
        MaxBounds = max;
    }

    this.CalculateSize = function ()
    {
        Size = subtractV3(MaxBounds, MinBounds);
    }
    
    this.Destroy = function ()
    {
        MeshBuffers.Destroy();
    }

    var MinBounds;
    var MaxBounds;
    var Size;
    var MeshBuffers;
    this.Vertices;
}