### MySQL

# SQL 语句

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