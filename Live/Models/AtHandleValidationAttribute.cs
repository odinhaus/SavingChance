using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Live.Models
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class AtHandleValidationAttribute : ValidationAttribute
    {
        public static ValidationResult IsValid(string text)
        {
            var regex = new Regex(@"@\w{2}");
            var result = regex.Match(text);
            if (result.Success)
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("The Unique Handle should start with an @, be at least 2 characters long, and contain only letters and/or numbers.");
            }
        }
    }
}
