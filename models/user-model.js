// This is the model for each user in the User table of the Translate database
// There are four user specified fields: first name, last name, email, and password
// There three system managed fields: id, createdAt, and updatedAt

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        first_name:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        last_name:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        email: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        password:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        }
    },
    {
        defaultScope:
        {
            attributes: { exclude: ["password"] }
        }
    });
    
    return User;
  };
  