using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Dependencies;

namespace Live.DI
{
    /// <summary>
    /// The structure map dependency resolver.
    /// </summary>
    public class DependencyResolver : DependencyScope, IDependencyResolver
    {
        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="StructureMapDependencyResolver"/> class.
        /// </summary>
        /// <param name="container">
        /// The container.
        /// </param>
        public DependencyResolver(IContainer container)
            : base(container)
        {
        }

        #endregion

        #region Public Methods and Operators

        /// <summary>
        /// The begin scope.
        /// </summary>
        /// <returns>
        /// The System.Web.Http.Dependencies.IDependencyScope.
        /// </returns>
        public IDependencyScope BeginScope()
        {
            IContainer child = this.Container.GetNestedContainer();
            return new DependencyResolver(child);
        }

        #endregion
    }
}
