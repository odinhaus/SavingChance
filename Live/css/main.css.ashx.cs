using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace Live.css
{
    /// <summary>
    /// Summary description for main_css
    /// </summary>
    public class main_css : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/css";
            context.Response.Write(ParseCss(context));
        }

        private string ParseCss(HttpContext context)
        {
            var cssPath = context.Server.MapPath("~/css/main.css.template");
            var palettePath = context.Server.MapPath("~/css/images/palette.png");
            var css = File.ReadAllText(cssPath);
            using (var palette = (Bitmap)Bitmap.FromFile(palettePath))
            {
                var colorPalette = new ColorPalette(palette);
                ApplyColorSet(colorPalette.PrimarySet, ref css);
                ApplyColorSet(colorPalette.SecondarySet, ref css);
                ApplyColorSet(colorPalette.TertiarySet, ref css);
            }
            return css;
        }

        private void ApplyColorSet(ColorSet set, ref string css)
        {
            ApplyColorStyle(set.Primary, ref css);
            ApplyColorStyle(set.MidToneLight, ref css);
            ApplyColorStyle(set.MidToneDark, ref css);
            ApplyColorStyle(set.Light, ref css);
            ApplyColorStyle(set.Dark, ref css);
        }

        private void ApplyColorStyle(PaletteColor style, ref string css)
        {
            foreach(var sc in style.StyleColors)
            {
                css = css.Replace(sc.Key, sc.Value);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class ColorPalette
    {
        public ColorPalette(Bitmap palette)
        {
            /* PIXEL LOCATIONS  www.Paletton.com 400x75 PNG export palette
                
            Color               X   Y
            Primary.Primary     100 20
            Secondary.Primary   245 20
            Tertiary.Primary    350 20

            Primary.Light       30  60
            Primary.MTLight     75  60
            Primary.MTDark      125 60
            Primary.Dark        165 60

            Secondary.Light     210 60
            Secondary.MTLight   240 60
            Secondary.MTDark    265 60
            Secondary.Dark      285 60

            Tertiary.Light      310 60
            Tertiary.MTLight    340 60
            Tertiary.MTDark     360 60
            Tertiary.Dark       390 60

            */

            PrimarySet = new ColorSet()
            {
                Primary = new PaletteColor(palette.GetPixel(100, 20), "@primary.primary"),
                Light = new PaletteColor(palette.GetPixel(30, 60), "@primary.light"),
                MidToneLight = new PaletteColor(palette.GetPixel(75, 60), "@primary.mtlight"),
                MidToneDark = new PaletteColor(palette.GetPixel(125, 60), "@primary.mtdark"),
                Dark = new PaletteColor(palette.GetPixel(165, 60), "@primary.dark"),
            };
            SecondarySet = new ColorSet()
            {
                Primary = new PaletteColor(palette.GetPixel(245, 20), "@secondary.primary"),
                Light = new PaletteColor(palette.GetPixel(210, 60), "@secondary.light"),
                MidToneLight = new PaletteColor(palette.GetPixel(240, 60), "@secondary.mtlight"),
                MidToneDark = new PaletteColor(palette.GetPixel(265, 60), "@secondary.mtdark"),
                Dark = new PaletteColor(palette.GetPixel(285, 60), "@secondary.dark"),
            };
            TertiarySet = new ColorSet()
            {
                Primary = new PaletteColor(palette.GetPixel(350, 20), "@tertiary.primary"),
                Light = new PaletteColor(palette.GetPixel(310, 60), "@tertiary.light"),
                MidToneLight = new PaletteColor(palette.GetPixel(340, 60), "@tertiary.mtlight"),
                MidToneDark = new PaletteColor(palette.GetPixel(360, 60), "@tertiary.mtdark"),
                Dark = new PaletteColor(palette.GetPixel(390, 60), "@tertiary.dark"),
            };
        }
        public ColorSet PrimarySet { get; set; }
        public ColorSet SecondarySet { get; set; }
        public ColorSet TertiarySet { get; set; }
    }

    public class StyleColor
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class ColorSet
    {
        public PaletteColor Primary { get; set; }
        public PaletteColor Light { get; set; }
        public PaletteColor MidToneLight { get; set; }
        public PaletteColor MidToneDark { get; set; }
        public PaletteColor Dark { get; set; }
    }

    public class PaletteColor
    {
        public PaletteColor(Color color, string stylePrefix)
        {
            this.Color = color;
            this.StyleColors = new[]
            {
                new StyleColor()
                {
                     Key = stylePrefix + ".hex",
                     Value = color.ToHex()
                },
                new StyleColor()
                {
                     Key = stylePrefix + ".rgb",
                     Value = color.ToRgb()
                },
                new StyleColor()
                {
                     Key = stylePrefix + ".rgbp",
                     Value = color.ToRgbPartial()
                },
                new StyleColor()
                {
                     Key = stylePrefix + ".rgba",
                     Value = color.ToRgba()
                },
                new StyleColor()
                {
                     Key = stylePrefix + ".rgbap",
                     Value = color.ToRgbaPartial()
                },
            };
        }
        public Color Color { get; set; }
        public IEnumerable<StyleColor> StyleColors { get; set; }
    }

    public static class ColorEx
    {
        public static String ToHex(this Color c)
        {
            return "#" + c.R.ToString("X2") + c.G.ToString("X2") + c.B.ToString("X2");
        }

        public static String ToRgb(this Color c)
        {
            return "rgb(" + c.R.ToString() + "," + c.G.ToString() + "," + c.B.ToString() + ")";
        }

        public static String ToRgba(this Color c)
        {
            return "rgba(" + c.R.ToString() + "," + c.G.ToString() + "," + c.B.ToString() + "," + c.A.ToString() +")";
        }

        public static String ToRgbPartial(this Color c)
        {
            return c.R.ToString() + "," + c.G.ToString() + "," + c.B.ToString();
        }

        public static String ToRgbaPartial(this Color c)
        {
            return c.R.ToString() + "," + c.G.ToString() + "," + c.B.ToString() + "," + c.A.ToString();
        }
    }
}