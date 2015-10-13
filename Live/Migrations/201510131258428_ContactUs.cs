namespace Live.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ContactUs : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "ContactUs", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "ContactUs");
        }
    }
}
