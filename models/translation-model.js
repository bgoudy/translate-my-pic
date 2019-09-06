// This is the model for each translation in the Translations table of the Translate database
// There three system managed fields: id, createdAt, and updatedAt

module.exports = function(sequelize, DataTypes) {
    var Translation = sequelize.define("Translation", {
        user_id:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        translated_language:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        analyzed_keywords: 
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        translated_keywords:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                len: [1]
            }
        },
        deleted:
        {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
    
    return Translation;
  };
  