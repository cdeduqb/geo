-- 创建授权数据库
CREATE DATABASE IF NOT EXISTS cmslicense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 授予权限
GRANT ALL PRIVILEGES ON cmslicense.* TO 'cms'@'%';
FLUSH PRIVILEGES;
