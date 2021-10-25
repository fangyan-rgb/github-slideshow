### MySQL 

# SQL 查询语句

1. **基本查询** 

查询数据库 students 表的所有数据：
```sql
SELECT * FROM students;
```

2. **条件查询** 

查询分数80分以上且包含80分的学生：
```sql
SELECT * FROM students WHERE score >= 80;
```

查询分数80分以上且包含80分的男生：
```sql
SELECT * FROM students WHERE score >= 80 AND gender = 'M';
```

查询分数80分以上且包含80分的同学或者男同学：
```sql
SELECT * FROM students WHERE score >= 80 OR gender = 'M';
```

查询不是2班的同学：
```sql
SELECT * FROM students WHERE NOT class_id = 2;
```

3. **投影查询**

查询数据库 students 表中的学生姓名和分数：
```sql
SELECT score, name FROM students;
```

结合 WHERE 查询分数80分以上且包含80分的学生：
```sql
SELECT score, name FROM students WHERE score >= 80;
```

4. **排序**

使用 ORDER BY 对分数进行从低到高排序：
```sql
SELECT * FROM students ORDER BY score;
```

结合 DESC 进行倒序实现从高到低排序：
```sql
SELECT * FROM students ORDER BY score DESC;
```

如果有相同分数的，就按照id排序：
```sql
SELECT * FROM students ORDER BY score DESC, id;
```

查询一班的学生分数排名，WHERE 在 ORDER BY 的前面：
```sql
SELECT * FROM students WHERE class_id = 1 ORDER BY score DESC;
```

5. **分页查询**

- LIMIT 总是设定为 pageSize；
- OFFSET 计算公式为 pageSize * (pageIndex - 1)。

查询排序后10页每条第一页的数据：
```sql
SELECT * FROM students ORDER BY score DESC LIMIT 10 OFFSET 0;
```

LIMIT 10 OFFSET 0 代表从索引0开始到索引9，所以第二页就从10开始，以此类推：
```sql
SELECT * FROM students ORDER BY score DESC LIMIT 10 OFFSET 10;
```

如果 OFFSET 超出数据 length，则会得到空集：
```sql
SELECT * FROM students ORDER BY score DESC LIMIT 10 OFFSET 10000000;
```

6. **聚合查询**

- COUNT()   ：查询某一列的行数，结果是一张二维表
- SUM()     ：计算某一列的合计值，该列必须为数值类型
- AVG()     : 计算某一列的平均值，该列必须为数值类型
- MAX()     : 计算某一列的最大值
- MIN()     : 计算某一列的最小值

查询 students 表有多少条数据,此时 COUNT(*) 为列名
```sql
SELECT COUNT(*) FROM students;
```

设置别名，此时 num 为列名
```sql
SELECT COUNT(*) num FROM students;
```

如果要查每个班有多少人，可以结合 GROUP BY 子句进行分组查询
```sql
SELECT COUNT(*) num FROM students GROUP BY class_id;
```

查询男生有多少条记录，结合 WHERE 条件筛选
```sql
SELECT COUNT(*) boys FROM students WHERE gender = 'M';
```

计算男生的总分
```sql
SELECT SUM(score) total FROM students WHERE gender = 'M';
```

计算男生的平均分
```sql
SELECT AVG(score) average FROM students WHERE gender = 'M';
```

7. 多表查询

- SELECT * FROM <表1> <表2>

同时查询 students 和 classes 表,所查结果为两张表的“乘积”(旧版本，8.0不会这样)：
```sql
SELECT * FROM students classes;
```

考虑到列重复和数据重复，可以指定展示列并根据表来设置别名：
```sql
SELECT 
    students.id sid,
    students.name,
    students.gender,
    students.score,
    classes.id cid,
    classes.name cname,
    FROM students, classes;
```

对表名起一个别名，做到精简化：
```sql
SELECT 
    s.id sid,
    s.name,
    s.gender,
    s.score,
    c.id cid,
    c.name cname,
    FROM students s, classes c;
```

8. 连接查询（JOIN 查询）

- INNER JOIN            内连接：返回同时存在于两张表的行数据
- LEFT OUTER JOIN       外连接：返回左边表都存在的行数据，如果某一行只在左边表存在，那么结果会以 NULL 填充剩下的字段
- RIGHT OUTER JOIN      外连接：返回右边表都存在的行数据，如果某一行只在左边表存在，那么结果会以 NULL 填充剩下的字段
- FULL OUTER JOIN       外连接：返回两张表的所有行数据，并且自动以 NULL 填充对方不存在列的数据

JOIN查询需要先确定主表，然后把另一个表的数据“附加”到结果集上；

INNER JOIN是最常用的一种JOIN查询，它的语法是SELECT ... FROM <表1> INNER JOIN <表2> ON <条件...>；

JOIN查询仍然可以使用WHERE条件和ORDER BY排序。

选出所有学生，同时返回班级名称：
```sql
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score FROM students s INNER JOIN classes c ON s.class_id = c.id;
```

使用 OUTER JOIN ：
```sql
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score FROM students s RIGHT OUTER JOIN classes c ON s.class_id = c.id;
```

使用 FULL OUTER JOIN 查出两张表同时存在的数据:
```sql
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score FROM students s FULL OUTER JOIN classes c ON s.class_id = c.id;
```

# SQL 修改数据（增删改）

- INSERT：插入新数据
- UPDATE：修改已有数据
- DELETE：删除已有数据

1. INSERT
- 基本语法： INSERT INTO <表名> (字段1， 字段2， ...) VALUES (值1，值2， ...);
```sql
-- 添加一条新纪录
INSERT INTO students (class_id, name, gender, score) VALUES (2, '大牛', 'M', 80);
-- 查询并观察结果
SELECT * FROM students;
```

VALUES 字句可以指定多个记录值：
```sql
-- 一次性添加多条新纪录
INSERT INTO students (class_id, name, gender, score) VALUES
  (1, '大宝', 'M', 87),
  (2, '二宝', 'M', 81);

SELECT * FROM students;
```

2. UPDATE
- 基本语法： UPDATE <表名> SET 字段1=值1, 字段2=值2, ... 
```sql
-- 更新 id=1 的记录
UPDATE students SET name='大牛', score=66 WHERE id=1;
-- 查询并观察结果
SELECT * FROM students;
```

可以使用表单试，给80分以下的同学加10分：
```sql
UPDATE students SET score=score+10 WHERE score<80;
-- 查询并观察结果
SELECT * FROM students;
```

3. DELETE
- 基本语法： DELETE FROM <表名> WHERE ...
```sql
-- 删除 id=1 的记录
DELETE FROM students WHERE id=1;
-- 查询并观察结果
SELECT * FROM students;
```