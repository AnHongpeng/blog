# Sequelize 使用指南

## （一）模型

### 模型定义

使用 `define` 方法来定义模型和表之间的映射，随后 Sequelize 将自动添加 `createdAt` 和 `updatedAt` 属性，通过它们能够知道数据库条目何时进入数据库及最后一次的更新时间：

``` js
const Task = sequelize.define('task', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
})

// 还可以在每列上进行一些设置
const Foo = sequelize.define('foo', {
 // 如果未赋值,则自动设置值为 TRUE
 flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},

 // 设置默认时间为当前时间
 myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

 // 将allowNull设置为false会将NOT NULL添加到列中，
 // 这意味着当列为空时执行查询时将从DB抛出错误。 
 // 如果要在查询DB之前检查值不为空，请查看下面的验证部分。
 title: { type: Sequelize.STRING, allowNull: false},

 // 创建具有相同值的两个对象将抛出一个错误。 唯一属性可以是布尔值或字符串。
 // 如果为多个列提供相同的字符串，则它们将形成复合唯一键。
 uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex'},
 uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex'},

 // unique属性用来创建一个唯一约束。
 someUnique: {type: Sequelize.STRING, unique: true},
 
 // 这与在模型选项中创建索引完全相同。
 {someUnique: {type: Sequelize.STRING}},
 {indexes: [{unique: true, fields: ['someUnique']}]},

 // primaryKey用于定义主键。
 identifier: { type: Sequelize.STRING, primaryKey: true},

 // autoIncrement可用于创建自增的整数列
 incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },

 // 你可以通过'field'属性指定自定义字段名称：
 fieldWithUnderscores: { type: Sequelize.STRING, field: 'field_with_underscores' },

 // 这可以创建一个外键:
 bar_id: {
   type: Sequelize.INTEGER,

   references: {
     // 这是引用另一个模型
     model: Bar,

     // 这是引用模型的列名称
     key: 'id',

     // 这声明什么时候检查外键约束。 仅限PostgreSQL。
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
   }
 }
})
```

### 常用数据类型

``` js
Sequelize.STRING                      // VARCHAR(255)
Sequelize.STRING(1234)                // VARCHAR(1234)
Sequelize.STRING.BINARY               // VARCHAR BINARY
Sequelize.TEXT                        // TEXT
Sequelize.TEXT('tiny')                // TINYTEXT

Sequelize.INTEGER                     // INTEGER
Sequelize.BIGINT                      // BIGINT
Sequelize.BIGINT(11)                  // BIGINT(11)

Sequelize.FLOAT                       // FLOAT
Sequelize.FLOAT(11)                   // FLOAT(11)
Sequelize.FLOAT(11, 12)               // FLOAT(11,12)

Sequelize.REAL                        // REAL         仅限于PostgreSQL.
Sequelize.REAL(11)                    // REAL(11)     仅限于PostgreSQL.
Sequelize.REAL(11, 12)                // REAL(11,12)  仅限于PostgreSQL.

Sequelize.DOUBLE                      // DOUBLE
Sequelize.DOUBLE(11)                  // DOUBLE(11)
Sequelize.DOUBLE(11, 12)              // DOUBLE(11,12)

Sequelize.DECIMAL                     // DECIMAL
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

Sequelize.DATE                        // DATETIME 针对 mysql / sqlite, TIMESTAMP WITH TIME ZONE 针对 postgres
Sequelize.DATE(6)                     // DATETIME(6) 针对 mysql 5.6.4+. 小数秒支持多达6位精度
Sequelize.DATEONLY                    // DATE 不带时间.
Sequelize.BOOLEAN                     // TINYINT(1)

Sequelize.ENUM('value 1', 'value 2')  // 一个允许具有 “value 1” 和 “value 2” 的 ENUM
Sequelize.ARRAY(Sequelize.TEXT)       // 定义一个数组。 仅限于 PostgreSQL。
Sequelize.ARRAY(Sequelize.ENUM)       // 定义一个 ENUM 数组. 仅限于 PostgreSQL。

Sequelize.JSON                        // JSON 列. 仅限于 PostgreSQL, SQLite and MySQL.
Sequelize.JSONB                       // JSONB 列. 仅限于 PostgreSQL .

Sequelize.BLOB                        // BLOB (PostgreSQL 二进制)
Sequelize.BLOB('tiny')                // TINYBLOB (PostgreSQL 二进制. 其他参数是 medium 和 long)

Sequelize.UUID                        // PostgreSQL 和 SQLite 的 UUID 数据类型, CHAR(36) BINARY 针对于 MySQL (使用默认值: Sequelize.UUIDV1 或 Sequelize.UUIDV4 来让 sequelize 自动生成 ID)

Sequelize.CIDR                        // PostgreSQL 的 CIDR 数据类型
Sequelize.INET                        // PostgreSQL 的 INET 数据类型
Sequelize.MACADDR                     // PostgreSQL 的 MACADDR

Sequelize.RANGE(Sequelize.INTEGER)    // 定义 int4range 范围. 仅限于 PostgreSQL.
Sequelize.RANGE(Sequelize.BIGINT)     // 定义 int8range 范围. 仅限于 PostgreSQL.
Sequelize.RANGE(Sequelize.DATE)       // 定义 tstzrange 范围. 仅限于 PostgreSQL.
Sequelize.RANGE(Sequelize.DATEONLY)   // 定义 daterange 范围. 仅限于 PostgreSQL.
Sequelize.RANGE(Sequelize.DECIMAL)    // 定义 numrange 范围. 仅限于 PostgreSQL.

Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)) // 定义 tstzrange 范围的数组. 仅限于 PostgreSQL.

Sequelize.GEOMETRY                    // 空间列.  仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT')           // 具有几何类型的空间列.  仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
Sequelize.GEOMETRY('POINT', 4326)     // 具有几何类型和SRID的空间列.  仅限于 PostgreSQL (具有 PostGIS) 或 MySQL.
```

完整类型参阅 [DataTypes](https://sequelize.org/master/variable/index.html#static-variable-DataTypes)

### 数据检索/查找器

#### find - 搜索数据库中的一个特定元素

``` js
// 搜索已知的 ids
Project.findById(123).then(project => {
  // project 是 Project 的一个实例，在表中具有 id 为 123 的条目
  // 如果没有这样的条目，将得到 null
})

// 搜索属性
Project.findOne({ where: { title: 'aProject' } }).then(project => {
  // project 是 Project 表中 title 为 'aProject' 的第一个条目 || null
})
```

#### findAll - 搜索数据库中的多个元素

``` js
// 找到多个条目
Project.findAll().then(projects => {
  // projects 将是所有 Project 实例的数组
})

// 也可以：
Project.all().then(projects => {
  // projects 将是所有 Project 实例的数组
})

// 搜索特定属性 - 使用哈希
Project.findAll({ where: { name: 'A Project' } }).then(projects => {
  // projects将是一个具有指定 name 的 Project 实例数组
})

// 在特定范围内进行搜索
Project.findAll({ where: { id: [1,2,3] } }).then(projects => {
  // projects将是一系列具有 id 1,2 或 3 的项目
  // 这实际上是在做一个 IN 查询
})

Project.findAll({
  where: {
    id: {
      [Op.and]: {a: 5},           // 且 (a = 5)
      [Op.or]: [{a: 5}, {a: 6}],  // (a = 5 或 a = 6)
      [Op.gt]: 6,                // id > 6
      [Op.gte]: 6,               // id >= 6
      [Op.lt]: 10,               // id < 10
      [Op.lte]: 10,              // id <= 10
      [Op.ne]: 20,               // id != 20
      [Op.between]: [6, 10],     // 在 6 和 10 之间
      [Op.notBetween]: [11, 15], // 不在 11 和 15 之间
      [Op.in]: [1, 2],           // 在 [1, 2] 之中
      [Op.notIn]: [1, 2],        // 不在 [1, 2] 之中
      [Op.like]: '%hat',         // 包含 '%hat'
      [Op.notLike]: '%hat',       // 不包含 '%hat'
      [Op.iLike]: '%hat',         // 包含 '%hat' (不区分大小写)  (仅限 PG)
      [Op.notILike]: '%hat',      // 不包含 '%hat'  (仅限 PG)
      [Op.overlap]: [1, 2],       // && [1, 2] (PG数组重叠运算符)
      [Op.contains]: [1, 2],      // @> [1, 2] (PG数组包含运算符)
      [Op.contained]: [1, 2],     // <@ [1, 2] (PG数组包含于运算符)
      [Op.any]: [2,3],            // 任何数组[2, 3]::INTEGER (仅限 PG)
    },
    status: {
      [Op.not]: false,           // status 不为 FALSE
    }
  }
})
```

#### findAndCountAll - 在数据库中搜索多个元素，返回数据和总计数

它结合了 `findAll` 和 `count`，处理分页查询时十分便捷。处理成功后将返回包含 2 个属性的对象：

* `count`：整数，记录匹配语句的数据条目数
* `rows`：对象数组，在 `limit` 和 `offset` 范围内匹配 `where` 语句的数据；

``` js
Project
  .findAndCountAll({
     where: {
        title: {
          [Op.like]: 'foo%'
        }
     },
     offset: 10,
     limit: 2
  })
  .then(result => {
    console.log(result.count);
    console.log(result.rows);
  });
```

传递给 `findAndCountAll` 的 `options` 对象与 `findAll` 相同

## （二）查询

### where

无论是通过 `findAll/find` 或批量 `updates/destroys` 进行查询，都可以传递一个 `where` 对象来过滤查询。

`where` 通常用 `attribute: value` 键值对表示，其中 `value` 可以是匹配等式的数据或其他运算符的键值对对象，也可以是嵌套了 `or` 和 `and` 运算符的集合（生成复杂的 `AND/OR` 条件）。

``` js
const Op = Sequelize.Op;

Post.findAll({
  where: {
    authorId: 2
  }
});
// SELECT * FROM post WHERE authorId = 2

Post.findAll({
  where: {
    authorId: 12,
    status: 'active'
  }
});
// SELECT * FROM post WHERE authorId = 12 AND status = 'active';

Post.findAll({
  where: {
    [Op.or]: [{authorId: 12}, {authorId: 13}]
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.findAll({
  where: {
    authorId: {
      [Op.or]: [12, 13]
    }
  }
});
// SELECT * FROM post WHERE authorId = 12 OR authorId = 13;

Post.destroy({
  where: {
    status: 'inactive'
  }
});
// DELETE FROM post WHERE status = 'inactive';

Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      [Op.ne]: null
    }
  }
});
// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;

Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
// SELECT * FROM post WHERE char_length(status) = 6;
```
