using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Contact : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (this.Request.Form.Count > 0)
        {
            var path = Server.MapPath("Subscribers.txt");
            using (var fs = File.AppendText(path))
            {
                foreach (var item in this.Request.Form.AllKeys)
                {
                    fs.WriteLine(item + ": " + this.Request.Form[item]);
                }
                fs.WriteLine();
            }
        }
    }
}