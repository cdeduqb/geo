-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: cms
-- ------------------------------------------------------
-- Server version	5.7.44-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AICitation`
--

DROP TABLE IF EXISTS `AICitation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AICitation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `articleTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `query` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `citedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `position` int(11) NOT NULL DEFAULT '0',
  `context` text COLLATE utf8mb4_unicode_ci,
  `sourceUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `citationType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mention',
  PRIMARY KEY (`id`),
  KEY `AICitation_articleId_idx` (`articleId`),
  KEY `AICitation_platform_idx` (`platform`),
  KEY `AICitation_citedAt_idx` (`citedAt`),
  KEY `AICitation_citationType_idx` (`citationType`),
  CONSTRAINT `AICitation_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AICitation`
--

LOCK TABLES `AICitation` WRITE;
/*!40000 ALTER TABLE `AICitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `AICitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AIConfig`
--

DROP TABLE IF EXISTS `AIConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AIConfig` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apiKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `baseUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int(11) NOT NULL DEFAULT '0',
  `secretKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dailyTokenLimit` int(11) DEFAULT NULL,
  `monthlyTokenLimit` int(11) DEFAULT NULL,
  `useCase` enum('GENERAL','WRITING','CODE','IMAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GENERAL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AIConfig`
--

LOCK TABLES `AIConfig` WRITE;
/*!40000 ALTER TABLE `AIConfig` DISABLE KEYS */;
INSERT INTO `AIConfig` VALUES ('24519b5a-8529-4acc-9308-edd869d4f408','deepseek','sk-55fa3c1af76d4ac8983d683c22b5d072','deepseek-chat',1,'2026-01-07 09:53:29.310','2026-01-11 07:05:23.503','https://api.deepseek.com',0,NULL,NULL,NULL,'WRITING'),('85ced6a4-20ef-4069-ba29-4935a0fd83c2','deepseek','dd','deepseek-chat',1,'2026-01-08 16:42:00.018','2026-01-08 16:42:00.018','https://api.deepseek.com',0,NULL,NULL,NULL,'GENERAL'),('97e492dc-28dc-4396-8a8d-57f1d78ad631','volcengine','68951612-4e4f-473a-a1d5-5f1dd0e87d99','ep-20260111142811-9fsft',1,'2026-01-11 06:52:21.818','2026-01-11 07:30:47.540','https://ark.cn-beijing.volces.com/api/v3',0,NULL,NULL,NULL,'CODE'),('9ae1ea49-db5c-4549-aece-8a9f21d6d6e6','volcengine','68951612-4e4f-473a-a1d5-5f1dd0e87d99','ep-20260111142811-9fsft',1,'2026-01-11 07:29:32.804','2026-01-12 13:45:13.566','https://ark.cn-beijing.volces.com/api/v3',0,NULL,NULL,NULL,'IMAGE');
/*!40000 ALTER TABLE `AIConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AICreationTask`
--

DROP TABLE IF EXISTS `AICreationTask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AICreationTask` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `strategyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','PROCESSING','COMPLETED','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `error` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completedAt` datetime(3) DEFAULT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduledAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AICreationTask_articleId_fkey` (`articleId`),
  KEY `AICreationTask_projectId_fkey` (`projectId`),
  KEY `AICreationTask_strategyId_fkey` (`strategyId`),
  CONSTRAINT `AICreationTask_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `AICreationTask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `ArticleAutomationProject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AICreationTask_strategyId_fkey` FOREIGN KEY (`strategyId`) REFERENCES `AIStrategy` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AICreationTask`
--

LOCK TABLES `AICreationTask` WRITE;
/*!40000 ALTER TABLE `AICreationTask` DISABLE KEYS */;
INSERT INTO `AICreationTask` VALUES ('1459546c-23e4-495b-8a2c-76f0cfc41996','d521e6dd-403a-4f24-ad66-424eef77e7fa','权威分析：小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-15 03:36:02.504'),('14b674a6-4f3b-4f78-9a37-fd2f980a7e78','d521e6dd-403a-4f24-ad66-424eef77e7fa','专家视角：小程序开发','西仁科技','FAILED',NULL,'AI API error: 401 Unauthorized - {\"error\":{\"message\":\"Authentication Fails, Your api key: dd is invalid\",\"type\":\"authentication_error\",\"param\":null,\"code\":\"invalid_request_error\"}} ','2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-12 05:12:02.503'),('4e6f66eb-32ac-46dc-9a2c-941764523b32','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','FAILED',NULL,'AI API error: 401 Unauthorized - {\"error\":{\"message\":\"Authentication Fails, Your api key: dd is invalid\",\"type\":\"authentication_error\",\"param\":null,\"code\":\"invalid_request_error\"}} ','2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-11 07:39:02.503'),('7d57c639-7d34-4dae-929c-7e24566f02bf','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-13 03:44:02.504'),('991e6ff3-87aa-4c89-9cfb-04b74bdc9d33','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-14 05:46:02.504'),('a12e37ec-0285-409d-988a-ec711ebe1923','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','FAILED',NULL,'AI API error: 401 Unauthorized - {\"error\":{\"message\":\"Authentication Fails, Your api key: dd is invalid\",\"type\":\"authentication_error\",\"param\":null,\"code\":\"invalid_request_error\"}} ','2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-12 06:57:02.503'),('a1a528b1-3866-472f-a0c9-127081d26508','d521e6dd-403a-4f24-ad66-424eef77e7fa','一文读懂：小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-14 07:21:02.504'),('ac76e6dd-18df-40e1-90bd-e639e68069e8','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','COMPLETED','b7c6daad-4f79-4b32-a3ad-cc280615a22d',NULL,'2026-01-11 05:15:02.506','2026-01-11 05:30:40.292','6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-11 05:25:02.502'),('aee263c0-fb19-4b5c-8a7c-d474e50ebfc5','d521e6dd-403a-4f24-ad66-424eef77e7fa','行业观察：小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-13 08:39:02.504'),('b33c54ea-8117-4b22-aa39-244e9c87c11d','d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','西仁科技','PENDING',NULL,NULL,'2026-01-11 05:15:02.506',NULL,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','2026-01-15 02:30:02.504');
/*!40000 ALTER TABLE `AICreationTask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AISearchRanking`
--

DROP TABLE IF EXISTS `AISearchRanking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AISearchRanking` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyword` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ranking` int(11) NOT NULL,
  `mentionRate` double NOT NULL DEFAULT '0',
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` text COLLATE utf8mb4_unicode_ci,
  `checkedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AISearchRanking_keyword_platform_idx` (`keyword`,`platform`),
  KEY `AISearchRanking_checkedAt_idx` (`checkedAt`),
  KEY `AISearchRanking_articleId_idx` (`articleId`),
  CONSTRAINT `AISearchRanking_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AISearchRanking`
--

LOCK TABLES `AISearchRanking` WRITE;
/*!40000 ALTER TABLE `AISearchRanking` DISABLE KEYS */;
/*!40000 ALTER TABLE `AISearchRanking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AIStrategy`
--

DROP TABLE IF EXISTS `AIStrategy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AIStrategy` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `temperature` double NOT NULL DEFAULT '0.7',
  `maxTokens` int(11) DEFAULT NULL,
  `targetType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `type` enum('GENERAL','WRITING','CODE','IMAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WRITING',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AIStrategy`
--

LOCK TABLES `AIStrategy` WRITE;
/*!40000 ALTER TABLE `AIStrategy` DISABLE KEYS */;
INSERT INTO `AIStrategy` VALUES ('4682c45e-1fa1-4a1e-95e5-132b4dc18867','写实风格','一张写实风格的照片，准确描绘以下场景：{selection}。光影自然，细节丰富，类似国家地理杂志的摄影风格。',0.7,NULL,'article','2026-01-12 13:13:57.535','2026-01-12 13:13:57.535','IMAGE'),('7a836b2c-12b8-49bf-9d45-68773e20e112','抽象艺术图片','一张富有创意的抽象艺术图片，灵感来源于：{title}。使用大胆的色彩对比和流动的线条，表现摘要中的核心概念：{summary}。风格类似现代数字艺术，视觉冲击力强。',0.7,NULL,'IMAGE_COVER','2026-01-12 13:16:15.207','2026-01-12 13:16:15.207','IMAGE'),('d521e6dd-403a-4f24-ad66-424eef77e7fa','小程序开发','小程序开发',0.7,NULL,'article','2026-01-06 18:45:42.058','2026-01-07 09:47:56.713','WRITING');
/*!40000 ALTER TABLE `AIStrategy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AITokenUsage`
--

DROP TABLE IF EXISTS `AITokenUsage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AITokenUsage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `configId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokensUsed` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AITokenUsage_configId_date_key` (`configId`,`date`),
  KEY `AITokenUsage_date_idx` (`date`),
  CONSTRAINT `AITokenUsage_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `AIConfig` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AITokenUsage`
--

LOCK TABLES `AITokenUsage` WRITE;
/*!40000 ALTER TABLE `AITokenUsage` DISABLE KEYS */;
/*!40000 ALTER TABLE `AITokenUsage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Article`
--

DROP TABLE IF EXISTS `Article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Article` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `coverImage` text COLLATE utf8mb4_unicode_ci,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED','SCHEDULED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aiGenerated` tinyint(1) NOT NULL DEFAULT '0',
  `aiPrompt` text COLLATE utf8mb4_unicode_ci,
  `views` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `citations` json DEFAULT NULL,
  `entities` json DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `automationProjectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh',
  `translationGroupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Article_slug_lang_key` (`slug`,`lang`),
  KEY `Article_lang_idx` (`lang`),
  KEY `Article_translationGroupId_idx` (`translationGroupId`),
  KEY `Article_authorId_fkey` (`authorId`),
  KEY `Article_automationProjectId_fkey` (`automationProjectId`),
  KEY `Article_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Article_automationProjectId_fkey` FOREIGN KEY (`automationProjectId`) REFERENCES `ArticleAutomationProject` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Article_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Article`
--

LOCK TABLES `Article` WRITE;
/*!40000 ALTER TABLE `Article` DISABLE KEYS */;
INSERT INTO `Article` VALUES ('2089ed9c-7973-45de-93f2-948f05576dd1','Mini Program Development Guide: Advantages, Steps, and Platform Selection','mini-program-development-guide-advantages-steps-platforms-en','<p>Mini program development is a technology that leverages super app platforms like <strong>WeChat</strong> and <strong>Alipay</strong> to quickly build and publish lightweight applications. Its greatest benefits are <strong>low development cost</strong>, <strong>fast dissemination speed</strong>, and the fact that users can use it without downloading or installing it, making it highly suitable for high-frequency but lightweight business scenarios such as e-commerce, tools, and lifestyle services.</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794375185-1767794375186-g7p530.png\" alt=\"Typical application interface of a mini program on a mobile phone screen\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">Figure: Typical application interface of a mini program on a mobile phone screen</figcaption>\r\n</figure>\r\n\r\n<h3>Core Advantages of Mini Program Development</h3>\r\n<p>Compared to native apps that require downloading, mini programs have several distinct advantages:</p>\r\n<ul>\r\n    <li><strong>Low development barrier</strong>: Primarily using front-end technologies like <strong>JavaScript</strong> and <strong>CSS</strong>, which are relatively easy to learn. Using frameworks like <strong>uni-app</strong> and <strong>Taro</strong> allows writing one set of code to create mini programs for multiple platforms.</li>\r\n    <li><strong>Easy customer acquisition</strong>: Leveraging the massive traffic of platforms like WeChat, users can easily open them by scanning QR codes or sharing with friends, resulting in a very short dissemination chain.</li>\r\n    <li><strong>Smooth experience</strong>: Although the functionality may not be as comprehensive as large apps, they start up quickly and operate smoothly, fully meeting daily usage needs.</li>\r\n    <li><strong>Fast launch</strong>: The review and publishing process is much simpler than app stores, making updates and iterations very flexible.</li>\r\n</ul>\r\n\r\n<h3>How to Start a Mini Program Project?</h3>\r\n<p>From idea to launch, it mainly involves the following steps:</p>\r\n\r\n<h4>Step 1: Clarify What to Do</h4>\r\n<p>First, clearly define what problem your mini program will solve and who the target users are. At the same time, be sure to review platform specifications like the <strong>WeChat Mini Program Design Guidelines</strong> to ensure the design meets requirements and provides a good user experience.</p>\r\n\r\n<h4>Step 2: Choose a Technical Solution</h4>\r\n<p>Based on project requirements and team situation, choosing the right technology stack is crucial. The main options are:</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794377218-1767794377218-46eioj.png\" alt=\"Comparison diagram of three mini program technical solutions\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">Figure: Comparison diagram of three mini program technical solutions</figcaption>\r\n</figure><table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\r\n    <tbody><tr>\r\n        <th>Technical Solution</th>\r\n        <th>Characteristics</th>\r\n        <th>Suitable for What Projects</th>\r\n\r\n    </tr>\r\n    <tr>\r\n        <td><strong>Native Development</strong></td>\r\n        <td>Using the platform\'s official language (e.g., WeChat\'s <strong>WXML</strong>, <strong>WXSS</strong>), offering the best performance and integration with platform capabilities.</td>\r\n        <td>Projects that particularly emphasize performance or require exclusive platform features.</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>Cross-platform Framework</strong> (e.g., uni-app, Taro)</td>\r\n        <td>Write one set of code that can be published to multiple mini program platforms like WeChat and Alipay simultaneously, and can even be made into <strong>Apps</strong> or <strong>H5</strong>.</td>\r\n        <td>Projects needing to cover multiple channels, aiming to save manpower and unify the technology stack.</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>Cloud Development</strong></td>\r\n        <td>The platform directly provides backend services like databases, storage, and cloud functions, eliminating the need to set up your own server.</td>\r\n        <td>Rapid validation by individual developers or startup teams, or small to medium-sized projects.</td>\r\n    </tr>\r\n</tbody></table>\r\n\r\n<h4>Step 3: Development and Debugging</h4>\r\n<p>Use the <strong>developer tools</strong> provided by the platform to write code, allowing real-time preview of effects. Focus on debugging key functions like network requests and user login authorization.</p>\r\n\r\n<h4>Step 4: Testing and Release</h4>\r\n<p>Conduct comprehensive functional testing and check compatibility across different phone models. Once everything is fine, submit it to the platform for review. After approval, users can search and use it.</p>\r\n\r\n<h3>Where Are They Mainly Used? What Should Be Noted?</h3>\r\n<p>Mini programs are particularly common in the following areas:</p>\r\n<ul>\r\n    <li><strong>E-commerce and Retail</strong>: Quickly open stores, drive sales through social sharing.</li>\r\n    <li><strong>Lifestyle Services</strong>: Ordering food, making reservations, querying information.</li>\r\n    <li><strong>Tool Assistants</strong>: Calculators, expense tracking, document processing.</li>\r\n    <li><strong>Internal Enterprise Applications</strong>: Reimbursement, approvals, information queries.</li>\r\n</ul>\r\n<p>During development, several points must be kept in mind:</p>\r\n<ul>\r\n    <li><strong>Follow Rules</strong>: Strictly adhere to the operational rules of each platform; violations may lead to the mini program being taken down.</li>\r\n    <li><strong>Emphasize Performance</strong>: Strictly control code package size, optimize images, ensuring the mini program is ready to use upon opening without making users wait.</li>\r\n    <li><strong>Consider Retention</strong>: Users leaving after use is a characteristic, but you can design ways to bring them back through features like <strong>subscription messages</strong> and favorites.</li>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794379129-1767794379129-agvu4p.png\" alt=\"Schematic diagram of mini program user retention and interaction features\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">Figure: Schematic diagram of mini program user retention and interaction features</figcaption>\r\n</figure>\r\n    <li><strong>Ensure Security</strong>: Properly safeguard user data, clearly inform users of the purpose when obtaining information, and comply with relevant laws like the <strong>Personal Information Protection Law</strong>.</li>\r\n</ul>\r\n\r\n<h3>Frequently Asked Questions (FAQ)</h3>\r\n<p><strong>Q1: What is the main difference between a mini program and a regular app (native app)?</strong><br>\r\nA1: The core difference lies in the <strong>installation method</strong>. Mini programs do not require downloading and installation from app stores; they can be searched and used within apps like WeChat, and users can leave after use. In contrast, native apps need to be downloaded and installed on the phone\'s home screen. This leads to a series of differences in development cost, release cycle, and user acquisition methods.</p>\r\n\r\n<p><strong>Q2: Is learning mini program development difficult? What background is needed?</strong><br>\r\nA2: If you have a foundation in front-end technologies like <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JavaScript</strong>, getting started will be very quick. The mini program development framework itself is not difficult, and official documentation and community resources are abundant. For beginners, starting with understanding the mini program\'s lifecycle, page structure, and basic APIs is a good approach.</p>\r\n\r\n<p><strong>Q3: Will using cross-platform frameworks like uni-app or Taro result in worse performance compared to native development?</strong><br>\r\nA3: In the vast majority of business scenarios, users will not perceive any performance difference. These frameworks are already very mature and ultimately compile into each platform\'s native code. Choosing a framework is mainly for <strong>development efficiency</strong> and <strong>multi-platform uniformity</strong>. Only when extremely pursuing performance or using very niche native components should pure native development be considered.</p>\r\n\r\n<p><strong>Q4: How do mini programs make money?</strong><br>\r\nA4: Mini programs have diverse monetization models, such as: directly serving as a <strong>sales channel for e-commerce</strong>; offering paid memberships or <strong>value-added services</strong>; hosting <strong>advertisements</strong> for traffic revenue; or acting as an online entry point for offline services, guiding users to in-store consumption. The core still depends on what value your mini program provides to users.</p>','Understand the core advantages of mini program development, including low cost, rapid dissemination, and no need for download and installation. Explore the development steps and best practices for mini programs on platforms like WeChat and Alipay.','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,0,NULL,2,'2026-01-07 16:29:13.482','2026-01-07 16:56:54.067',NULL,NULL,0,NULL,'en','29982c8c-1929-45f5-b831-0c3e3faf75dc'),('317b0412-3e34-410b-a40b-89447776523c','刚回家','fghj','fghj&nbsp;','fgh','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,0,NULL,1,'2026-01-06 18:43:30.044','2026-01-07 16:28:07.740','[]','[]',0,NULL,'zh','d693ba66-4776-449a-afc8-084e5214d78f'),('395e268d-a6ae-45d2-98df-226364af50b6','小程序开发指南：优势、步骤与平台选择','mini-program-development-guide-advantages-steps-platforms','<p>小程序开发是一种利用<strong>微信</strong>、<strong>支付宝</strong>等超级App平台，快速构建和发布轻量级应用的技术。它最大的好处是<strong>开发成本低</strong>、<strong>传播速度快</strong>，用户无需下载安装就能使用，非常适合电商、工具、生活服务等高频但轻量的业务场景。</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794375185-1767794375186-g7p530.png\" alt=\"小程序在手机屏幕上的典型应用界面\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">图：小程序在手机屏幕上的典型应用界面</figcaption>\r\n</figure>\r\n\r\n<h3>小程序开发的核心优势</h3>\r\n<p>和需要下载的原生App相比，小程序有几个明显的优点：</p>\r\n<ul>\r\n    <li><strong>开发门槛低</strong>：主要用<strong>JavaScript</strong>、<strong>CSS</strong>这些前端技术，学习起来相对容易。用<strong>uni-app</strong>、<strong>Taro</strong>这类框架，还能一套代码做出多个平台的小程序。</li>\r\n    <li><strong>获客方便</strong>：背靠微信等平台的巨大流量，用户通过扫码、朋友分享就能轻松打开，传播链条很短。</li>\r\n    <li><strong>体验流畅</strong>：虽然功能不如大型App全面，但启动快、操作顺滑，完全能满足日常使用。</li>\r\n    <li><strong>上线快</strong>：审核和发布流程比应用商店简单得多，更新迭代非常灵活。</li>\r\n</ul>\r\n\r\n<h3>如何开始一个小程序项目？</h3>\r\n<p>从想法到上线，主要会经历下面几个步骤：</p>\r\n\r\n<h4>第一步：想清楚做什么</h4>\r\n<p>先明确你的小程序要解决什么问题，目标用户是谁。同时，一定要去看看<strong>微信小程序设计指南</strong>这类平台规范，确保设计出来的东西符合要求，用户体验好。</p>\r\n\r\n<h4>第二步：选择技术方案</h4>\r\n<p>根据项目需求和团队情况，选对技术栈很重要。主要选择有这几种：</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794377218-1767794377218-46eioj.png\" alt=\"三种小程序技术方案对比示意图\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">图：三种小程序技术方案对比示意图</figcaption>\r\n</figure><table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\r\n    <tbody><tr>\r\n        <th>技术方案</th>\r\n        <th>特点</th>\r\n        <th>适合什么项目</th>\r\n\r\n    </tr>\r\n    <tr>\r\n        <td><strong>原生开发</strong></td>\r\n        <td>用平台官方语言（如微信的<strong>WXML</strong>、<strong>WXSS</strong>），性能和平台能力结合最好。</td>\r\n        <td>特别注重性能，或需要用到平台独家功能。</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>跨端框架</strong>（如uni-app, Taro）</td>\r\n        <td>写一套代码，能同时发布到微信、支付宝等多个小程序平台，甚至能做成<strong>App</strong>或<strong>H5</strong>。</td>\r\n        <td>需要覆盖多个渠道，想节省人力、统一技术栈。</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>云开发</strong></td>\r\n        <td>平台直接提供数据库、存储、云函数等后端服务，不用自己搭服务器。</td>\r\n        <td>个人开发者、创业团队做快速验证，或中小型项目。</td>\r\n    </tr>\r\n</tbody></table>\r\n\r\n<h4>第三步：动手开发与调试</h4>\r\n<p>使用平台提供的<strong>开发者工具</strong>写代码，可以实时看到效果。重点调试好网络请求、用户登录授权这些关键功能。</p>\r\n\r\n<h4>第四步：测试与发布</h4>\r\n<p>全面测试功能，并在不同手机型号上看看兼容性。没问题就可以提交给平台审核，通过后用户就能搜索和使用了。</p>\r\n\r\n<h3>主要用在哪里？要注意什么？</h3>\r\n<p>小程序在下面这些领域特别常见：</p>\r\n<ul>\r\n    <li><strong>电商零售</strong>：快速开店，社交分享带货。</li>\r\n    <li><strong>生活服务</strong>：点餐、预约、查询信息。</li>\r\n    <li><strong>工具助手</strong>：计算器、记账、文档处理。</li>\r\n    <li><strong>企业内部应用</strong>：报销、审批、信息查询。</li>\r\n</ul>\r\n<p>开发时，有几点必须留心：</p>\r\n<ul>\r\n    <li><strong>守规矩</strong>：严格遵守各平台的运营规则，违规可能导致小程序被下架。</li>\r\n    <li><strong>重性能</strong>：严格控制代码包大小，优化图片，让小程序点开就能用，别让用户等。</li>\r\n    <li><strong>想留存</strong>：用户用完就走是特点，但可以通过<strong>订阅消息</strong>、收藏等功能，设计一些让他们再回来的方法。</li>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794379129-1767794379129-agvu4p.png\" alt=\"小程序用户留存与互动功能示意图\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">图：小程序用户留存与互动功能示意图</figcaption>\r\n</figure>\r\n    <li><strong>保安全</strong>：妥善保管用户数据，获取信息时要明确告知用途，遵守《个人信息保护法》等相关法律。</li>\r\n</ul>\r\n\r\n<h3>常见问题解答 (FAQ)</h3>\r\n<p><strong>Q1: 小程序和普通App（原生App）最主要的区别是什么？</strong><br>\r\nA1: 最核心的区别在于<strong>安装方式</strong>。小程序无需从应用商店下载安装，在微信等App内即搜即用，用完即走。而原生App需要下载并安装在手机桌面上。这带来了开发成本、发布周期和用户获取方式上的一系列不同。</p>\r\n\r\n<p><strong>Q2: 学小程序开发难吗？需要什么基础？</strong><br>\r\nA2: 如果你有<strong>HTML</strong>、<strong>CSS</strong>和<strong>JavaScript</strong>这些前端基础，上手会非常快。小程序开发框架本身不难，官方文档和社区资源也很丰富。对于新手，从理解小程序的生命周期、页面结构和基础API开始是个好起点。</p>\r\n\r\n<p><strong>Q3: 用uni-app、Taro这些跨端框架，性能会不会比原生开发差？</strong><br>\r\nA3: 在绝大多数业务场景下，性能差异用户是感知不到的。这些框架已经非常成熟，它们最终也是编译成各平台的原生代码。选择框架主要为了<strong>开发效率</strong>和<strong>多端统一</strong>。只有在极端追求性能或使用非常冷门的原生组件时，才需要考虑纯原生开发。</p>\r\n\r\n<p><strong>Q4: 小程序怎么赚钱？</strong><br>\r\nA4: 小程序的盈利模式很多样，比如：直接作为<strong>电商销售</strong>渠道；提供付费会员或<strong>增值服务</strong>；承接<strong>广告</strong>获得流量收入；或者作为线下服务的线上入口，引导到店消费。核心还是看你的小程序为用户提供了什么价值。</p>','了解小程序开发的核心优势，包括低成本、快速传播和无需下载安装。探索微信、支付宝等平台的小程序开发步骤和最佳实践。','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,1,NULL,35,'2026-01-07 13:59:53.501','2026-01-10 13:12:17.678','[{\"url\": \"https://developers.weixin.qq.com/miniprogram/dev/framework/\", \"year\": \"2023\", \"title\": \"微信小程序官方文档\", \"author\": \"腾讯微信团队\"}, {\"url\": \"https://opendocs.alipay.com/mini/developer\", \"year\": \"2023\", \"title\": \"支付宝小程序开发指南\", \"author\": \"蚂蚁集团\"}, {\"url\": \"https://taro-docs.jd.com/taro/docs/\", \"year\": \"2023\", \"title\": \"跨平台小程序开发框架Taro官方文档\", \"author\": \"京东凹凸实验室\"}, {\"url\": \"https://uniapp.dcloud.net.cn/\", \"year\": \"2023\", \"title\": \"uni-app跨端开发框架官方文档\", \"author\": \"DCloud\"}, {\"year\": \"2021\", \"title\": \"小程序开发入门与实践\", \"author\": \"张荣超\"}]','[{\"text\": \"微信\", \"type\": \"组织\", \"relevance\": 9}, {\"text\": \"支付宝\", \"type\": \"组织\", \"relevance\": 8}, {\"text\": \"小程序开发\", \"type\": \"概念\", \"relevance\": 10}, {\"text\": \"JavaScript\", \"type\": \"概念\", \"relevance\": 7}, {\"text\": \"CSS\", \"type\": \"概念\", \"relevance\": 7}, {\"text\": \"uni-app\", \"type\": \"产品\", \"relevance\": 8}, {\"text\": \"Taro\", \"type\": \"产品\", \"relevance\": 8}, {\"text\": \"微信小程序设计指南\", \"type\": \"概念\", \"relevance\": 6}, {\"text\": \"原生开发\", \"type\": \"概念\", \"relevance\": 7}, {\"text\": \"WXML\", \"type\": \"概念\", \"relevance\": 6}, {\"text\": \"WXSS\", \"type\": \"概念\", \"relevance\": 6}, {\"text\": \"跨端框架\", \"type\": \"概念\", \"relevance\": 7}, {\"text\": \"App\", \"type\": \"概念\", \"relevance\": 6}, {\"text\": \"H5\", \"type\": \"概念\", \"relevance\": 6}, {\"text\": \"微信\", \"type\": \"Product\", \"description\": \"腾讯开发的社交应用平台，支持小程序运行\"}, {\"text\": \"支付宝\", \"type\": \"Product\", \"description\": \"蚂蚁集团开发的支付和生活服务平台，支持小程序运行\"}, {\"text\": \"JavaScript\", \"type\": \"Concept\", \"description\": \"前端编程语言，用于小程序开发\"}, {\"text\": \"CSS\", \"type\": \"Concept\", \"description\": \"样式表语言，用于小程序界面设计\"}, {\"text\": \"uni-app\", \"type\": \"Product\", \"description\": \"跨端开发框架，支持一套代码多端发布\"}, {\"text\": \"Taro\", \"type\": \"Product\", \"description\": \"跨端开发框架，支持一套代码多端发布\"}, {\"text\": \"WXML\", \"type\": \"Concept\", \"description\": \"微信小程序标记语言，类似HTML\"}, {\"text\": \"WXSS\", \"type\": \"Concept\", \"description\": \"微信小程序样式语言，类似CSS\"}, {\"text\": \"HTML\", \"type\": \"Concept\", \"description\": \"超文本标记语言，前端开发基础\"}, {\"text\": \"微信小程序设计指南\", \"type\": \"Product\", \"description\": \"微信平台提供的小程序设计规范文档\"}]',0,NULL,'zh','29982c8c-1929-45f5-b831-0c3e3faf75dc'),('39ba6e80-b022-4b67-aa0f-a25017783dfa','Just Got Home','fghj-en','fghj&nbsp;','fgh','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,0,NULL,0,'2026-01-07 16:28:10.686','2026-01-07 16:28:10.686',NULL,NULL,0,NULL,'en','d693ba66-4776-449a-afc8-084e5214d78f'),('3a60cea2-cde6-422b-8700-f69763d3eeea','很好','1767766802031','\r\n                <h1>很好</h1>\r\n                <p>这是一篇由 AI 自动生成的关于 <strong>很好</strong> 的文章草稿。</p>\r\n\r\n                    <h2>什么是 很好？</h2>\r\n                    <p><strong>很好</strong> 是一个...</p>\r\n                \r\n                <h2>主要特点</h2>\r\n                <ul>\r\n                    <li><strong>特点一</strong>：...</li>\r\n                    <li><strong>特点二</strong>：...</li>\r\n                </ul>\r\n                <h2>详细分析</h2>\r\n                <h3>核心优势</h3>\r\n                <p>...</p>\r\n                <h3>应用场景</h3>\r\n                <p>...</p>\r\n                <h2>常见问题 (FAQ)</h2>\r\n                \r\n                    Q1: ...?\r\n                    A1: ...\r\n                \r\n                <blockquote>\r\n                    <p>这是一个模拟的 AI 生成结果（GEO 优化版）。</p>\r\n                </blockquote>\r\n            ','','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9','156a8465-e5dc-4924-b1f0-5a71a1c22907',1,'哥哥哥哥家了你开门了;路径',3,'2026-01-07 06:20:02.032','2026-01-07 16:28:08.277','[]','[]',0,NULL,'zh','37f3033c-d436-4b43-9be1-85e6d646a9df'),('3ab5c9ee-6d12-4191-a922-0a1fd3120f53','很好','67769202028','\r\n                <h1>很好</h1>\r\n                <p>这是一篇由 AI 自动生成的关于 <strong>很好</strong> 的文章草稿。</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767781641420-1767781641420-7o0a6t.png\" alt=\"AI生成文章在现代化设备上呈现\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">图：AI生成文章在现代化设备上呈现</figcaption>\r\n</figure>\r\n\r\n                    <h2>什么是 很好？</h2>\r\n                    <p><strong>很好</strong> 是一个..</p>\r\n                <p>...</p>\r\n                <h3>应用场景</h3>\r\n                <p>\r\n</p><figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767781645280-1767781645280-ssn47y.png\" alt=\"多样化应用场景的网络化展示\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\"><span style=\"color: rgb(107, 114, 128); font-size: 14px; font-style: italic;\">图：多样化应用场景的网络化展示</span></figure>...<p></p>\r\n                <h2>常见问题 (FAQ)</h2>\r\n                \r\n                    Q1: ...?\r\n                    A1: ...\r\n                \r\n                <blockquote>\r\n                    <p>这是一个模拟的 AI 生成结果（GEO 优化版）。</p>\r\n                </blockquote>\r\n            ','\r\n                很好\r\n                这是一篇由 AI 自动生成的关于 很好 的文章草稿。\r\n\r\n                    什么是 很好？\r\n                    很好 是一个...\r\n                \r\n                主要特点\r\n                \r\n                    特点一','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,1,'哥哥哥哥家了你开门了;路径',6,'2026-01-07 07:00:02.029','2026-01-10 11:27:14.609','[]','[{\"text\": \"很好\", \"type\": \"Concept\", \"description\": \"文章讨论的核心概念\"}, {\"text\": \"AI\", \"type\": \"Concept\", \"description\": \"人工智能\"}, {\"text\": \"GEO\", \"type\": \"Concept\", \"description\": \"地理优化\"}]',0,NULL,'zh','3c3c157e-6d0a-4d1d-ae28-e1d79c27c31d'),('b7c6daad-4f79-4b32-a3ad-cc280615a22d','小程序开发','小程序开发-1768109440287','<h2>小程序开发：连接用户与服务的轻量化桥梁</h2>\n<p>小程序开发是一种基于超级应用平台（如微信、支付宝）构建轻量级应用程序的技术。它无需下载安装，即用即走，旨在为用户提供便捷、高效的服务体验，同时帮助企业以较低成本快速触达目标用户。</p>\n\n<h2>小程序开发的核心优势与价值</h2>\n<p>相较于传统的原生App，小程序因其独特的运行机制，展现出多方面的优势。这些优势直接关系到企业的投入产出比和用户体验。</p>\n\n<h3>降低开发与获客成本</h3>\n<p>小程序基于平台提供的统一框架开发，一次开发可适配不同操作系统，显著减少了开发时间和人力成本。同时，它依托于微信等拥有十亿级用户的平台生态，企业可以借助社交分享、附近的小程序、搜索等免费流量入口，以更低的成本获取用户。</p>\n\n<h3>提升用户体验与留存</h3>\n<p>“无需安装”的特性极大降低了用户的使用门槛。用户通过扫码或搜索即可使用服务，流程简洁。此外，小程序可以与平台的用户体系、支付系统无缝对接，并支持消息模板触达用户，这些都有助于提升用户的使用流畅度和后续留存率。</p>\n\n<h3>实现线上线下的高效融合</h3>\n<p>小程序是连接线下实体与线上服务的重要工具。例如，餐厅通过小程序实现扫码点餐、排队取号；零售门店通过小程序发放会员卡、优惠券，开展社区团购。这种融合有效提升了运营效率，丰富了服务场景。</p>\n\n<h2>小程序开发的关键流程与考量</h2>\n<p>一个成功的小程序项目，需要经过系统性的规划和执行。以下是开发过程中的几个关键环节：</p>\n\n<ul>\n  <li><strong>需求分析与定位：</strong>明确小程序要解决的核心问题、目标用户群体以及期望实现的主要功能。这是所有后续工作的基础。</li>\n  <li><strong>交互与视觉设计：</strong>设计符合平台规范且用户体验良好的界面。设计需简洁高效，重点突出核心功能，减少用户操作步骤。</li>\n  <li><strong>前端与后端开发：</strong>前端实现页面交互，后端处理业务逻辑与数据存储。需要确保代码性能，并考虑未来功能扩展的可能性。</li>\n  <li><strong>测试与上线：</strong>进行全面的功能测试、性能测试和兼容性测试，确保在不同设备和场景下稳定运行，然后提交至平台审核发布。</li>\n  <li><strong>运营与迭代：</strong>上线后，通过数据分析监控用户行为，收集反馈，并据此进行持续的版本优化和功能更新。</li>\n</ul>\n\n<h2>选择专业开发服务的重要性</h2>\n<p>对于大多数企业而言，自主组建技术团队开发小程序成本高昂。因此，选择一家经验丰富、技术可靠的服务商至关重要。以 <strong>西仁科技</strong> 为例，一家专业的开发服务商通常能提供以下价值：</p>\n\n<table>\n  <tbody><tr>\n    <th>服务维度</th>\n    <th>具体价值</th>\n  </tr>\n  <tr>\n    <td>技术专业性</td>\n    <td>熟悉各平台最新开发规范与API，能应对复杂业务逻辑，保证程序稳定高效。</td>\n  </tr>\n  <tr>\n    <td>行业经验</td>\n    <td>拥有多行业（如零售、餐饮、教育）的小程序开发案例，能提供更贴合业务场景的解决方案。</td>\n  </tr>\n  <tr>\n    <td>项目管控</td>\n    <td>提供从需求对接到上线运维的全流程服务，确保项目按时、按质交付。</td>\n  </tr>\n  <tr>\n    <td>持续支持</td>\n    <td>提供后期的技术维护、故障排查和功能迭代服务，保障小程序长期稳定运营。</td>\n  </tr>\n</tbody></table>\n\n<p>企业在选择服务商时，应重点考察其过往案例、技术团队构成和售后服务承诺，而不仅仅是比较报价。</p>\n\n<h2>常见问题 (FAQ)</h2>\n\n<h3>1. 小程序和手机App有什么区别？</h3>\n<p>主要区别在于：小程序无需从应用商店下载安装，即用即走，占用存储空间极小；而App需要下载安装，功能更强大、系统权限更高。小程序开发成本通常更低，上线更快，适合轻量级、高频次的服务场景。</p>\n\n<h3>2. 开发一个小程序需要多长时间？</h3>\n<p>开发周期取决于功能的复杂程度。一个功能简单的展示型小程序可能需2-4周；而包含在线交易、会员系统、营销工具等复杂功能的商城类小程序，则可能需要1-3个月甚至更长时间。</p>\n\n<h3>3. 小程序开发完成后需要每年缴费吗？</h3>\n<p>是的。主要涉及两部分费用：一是向平台方（如微信）支付的服务器租赁费（按年收取）；二是给开发服务商的维护服务费，用于系统维护、安全更新和技术支持。具体费用根据服务器配置和服务内容而定。</p>\n\n<h3>4. 如何让我的小程序被更多用户看到？</h3>\n<p>可以通过多种方式推广：优化小程序名称和简介，便于搜索；设计吸引人的分享卡片，鼓励用户社交分享；结合公众号内容进行引流；在线下门店放置小程序码；以及合理使用平台的广告投放工具等。</p>','小程序开发：连接用户与服务的轻量化桥梁\n小程序开发是一种基于超级应用平台（如微信、支付宝）构建轻量级应用程序的技术。它无需下载安装，即用即走，旨在为用户提供便捷、高效的服务体验，同时帮助企业以较低成本快速触达目标用户。\n\n小程序开发的核心优势与价值\n相较于传统的原生App，小程序因其独特的运行机制，展现出多方面的优势。这些优势直接关系到企业的投入产出比和用户体验。\n\n降低开发与获客成本\n小程序基于',NULL,'DRAFT','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,1,'小程序开发',0,'2026-01-11 05:30:40.289','2026-01-11 05:30:40.289',NULL,NULL,0,'6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','zh',NULL),('c6d4f1e8-19c0-4b86-8c1f-1c2612258f12','Very Good','1767766802031-en','\r\n                <h1>Very Good</h1>\r\n                <p>This is an AI-generated draft article about <strong>Very Good</strong>.</p>\r\n\r\n                    <h2>What is Very Good?</h2>\r\n                    <p><strong>Very Good</strong> is a...</p>\r\n                \r\n                <h2>Main Features</h2>\r\n                <ul>\r\n                    <li><strong>Feature One</strong>: ...</li>\r\n                    <li><strong>Feature Two</strong>: ...</li>\r\n                </ul>\r\n                <h2>Detailed Analysis</h2>\r\n                <h3>Core Advantages</h3>\r\n                <p>...</p>\r\n                <h3>Application Scenarios</h3>\r\n                <p>...</p>\r\n                <h2>Frequently Asked Questions (FAQ)</h2>\r\n                \r\n                    Q1: ...?\r\n                    A1: ...\r\n                \r\n                <blockquote>\r\n                    <p>This is a simulated AI-generated result (GEO optimized version).</p>\r\n                </blockquote>\r\n            ','','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9','156a8465-e5dc-4924-b1f0-5a71a1c22907',0,NULL,0,'2026-01-07 16:29:23.226','2026-01-07 16:29:23.226',NULL,NULL,0,NULL,'en','37f3033c-d436-4b43-9be1-85e6d646a9df'),('d3e45349-ecee-4e42-9f39-cd15e8ba07a1','ミニプログラム開発ガイド：メリット、手順、プラットフォーム選定','mini-program-kaihatsu-guide-meritto-tejun-platform-sentei-ja','<p>ミニプログラム開発は、<strong>WeChat</strong>や<strong>Alipay</strong>などのスーパーアプリプラットフォームを活用して、軽量なアプリケーションを迅速に構築・公開する技術です。その最大の利点は、<strong>開発コストが低い</strong>こと、<strong>拡散速度が速い</strong>こと、そしてユーザーがダウンロードやインストールをせずに利用できることであり、EC、ツール、生活サービスなどの高頻度かつ軽量なビジネスシーンに非常に適しています。</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794375185-1767794375186-g7p530.png\" alt=\"スマートフォン画面上のミニプログラムの典型的なアプリケーションインターフェース\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">図: スマートフォン画面上のミニプログラムの典型的なアプリケーションインターフェース</figcaption>\r\n</figure>\r\n\r\n<h3>ミニプログラム開発の核心的利点</h3>\r\n<p>ダウンロードが必要なネイティブアプリと比較して、ミニプログラムにはいくつかの明確な利点があります：</p>\r\n<ul>\r\n    <li><strong>開発のハードルが低い</strong>：主に<strong>JavaScript</strong>や<strong>CSS</strong>などのフロントエンド技術を使用し、比較的習得が容易です。<strong>uni-app</strong>や<strong>Taro</strong>などのフレームワークを使用すると、一つのコードで複数のプラットフォーム向けのミニプログラムを作成できます。</li>\r\n    <li><strong>顧客獲得が容易</strong>：WeChatなどのプラットフォームの巨大なトラフィックを活用し、QRコードをスキャンしたり友達と共有したりすることで簡単に開くことができ、拡散経路が非常に短いです。</li>\r\n    <li><strong>スムーズな体験</strong>：機能は大型アプリほど充実していないかもしれませんが、起動が速く操作もスムーズで、日常の使用ニーズを十分に満たします。</li>\r\n    <li><strong>迅速な公開</strong>：審査と公開のプロセスはアプリストアよりもはるかに簡素で、更新と反復が非常に柔軟です。</li>\r\n</ul>\r\n\r\n<h3>ミニプログラムプロジェクトを始めるには？</h3>\r\n<p>アイデアから公開まで、主に以下のステップを踏みます：</p>\r\n\r\n<h4>ステップ1: 何をするかを明確にする</h4>\r\n<p>まず、あなたのミニプログラムが解決する問題とターゲットユーザーを明確に定義します。同時に、<strong>WeChatミニプログラムデザインガイドライン</strong>などのプラットフォームの仕様を必ず確認し、設計が要件を満たし、良好なユーザー体験を提供することを保証します。</p>\r\n\r\n<h4>ステップ2: 技術ソリューションを選択する</h4>\r\n<p>プロジェクトの要件とチームの状況に基づいて、適切な技術スタックを選択することが重要です。主な選択肢は以下の通りです：</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794377218-1767794377218-46eioj.png\" alt=\"3つのミニプログラム技術ソリューションの比較図\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">図: 3つのミニプログラム技術ソリューションの比較図</figcaption>\r\n</figure><table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\r\n    <tbody><tr>\r\n        <th>技術ソリューション</th>\r\n        <th>特徴</th>\r\n        <th>適したプロジェクト</th>\r\n\r\n    </tr>\r\n    <tr>\r\n        <td><strong>ネイティブ開発</strong></td>\r\n        <td>プラットフォームの公式言語（例：WeChatの<strong>WXML</strong>、<strong>WXSS</strong>）を使用し、最高のパフォーマンスとプラットフォーム機能との統合を提供します。</td>\r\n        <td>パフォーマンスを特に重視する、または特定のプラットフォーム機能を必要とするプロジェクト。</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>クロスプラットフォームフレームワーク</strong>（例：uni-app、Taro）</td>\r\n        <td>一つのコードを書き、WeChatやAlipayなどの複数のミニプログラムプラットフォームに同時に公開でき、さらには<strong>アプリ</strong>や<strong>H5</strong>にすることもできます。</td>\r\n        <td>複数のチャネルをカバーする必要があり、人的リソースを節約し技術スタックを統一したいプロジェクト。</td>\r\n    </tr>\r\n    <tr>\r\n        <td><strong>クラウド開発</strong></td>\r\n        <td>プラットフォームが直接データベース、ストレージ、クラウド関数などのバックエンドサービスを提供し、独自のサーバーを構築する必要がありません。</td>\r\n        <td>個人開発者やスタートアップチームによる迅速な検証、または中小規模のプロジェクト。</td>\r\n    </tr>\r\n</tbody></table>\r\n\r\n<h4>ステップ3: 開発とデバッグ</h4>\r\n<p>プラットフォームが提供する<strong>開発者ツール</strong>を使用してコードを書き、効果をリアルタイムでプレビューできます。ネットワークリクエストやユーザーログイン認証などの主要機能のデバッグに重点を置きます。</p>\r\n\r\n<h4>ステップ4: テストと公開</h4>\r\n<p>包括的な機能テストを実施し、異なる機種間での互換性を確認します。問題がなければ、プラットフォームに審査を提出します。承認後、ユーザーは検索して利用できます。</p>\r\n\r\n<h3>主にどのような分野で使われているか？注意点は？</h3>\r\n<p>ミニプログラムは特に以下の分野で一般的です：</p>\r\n<ul>\r\n    <li><strong>ECと小売</strong>：迅速に店舗を開設し、ソーシャル共有を通じて販売を促進。</li>\r\n    <li><strong>生活サービス</strong>：食事の注文、予約、情報検索。</li>\r\n    <li><strong>ツールアシスタント</strong>：電卓、支出管理、文書処理。</li>\r\n    <li><strong>企業内アプリケーション</strong>：経費精算、承認、情報照会。</li>\r\n</ul>\r\n<p>開発中は、以下の点に留意する必要があります：</p>\r\n<ul>\r\n    <li><strong>ルールを遵守する</strong>：各プラットフォームの運営規則を厳格に遵守すること。違反するとミニプログラムが削除される可能性があります。</li>\r\n    <li><strong>パフォーマンスを重視する</strong>：コードパッケージのサイズを厳密に管理し、画像を最適化して、ミニプログラムが開いたらすぐに使用でき、ユーザーを待たせないようにします。</li>\r\n    <li><strong>リテンションを考慮する</strong>：使用後に離脱するのは特徴ですが、<strong>サブスクリプションメッセージ</strong>やお気に入り登録などの機能を通じて再訪を促す仕組みを設計できます。</li>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767794379129-1767794379129-agvu4p.png\" alt=\"ミニプログラムのユーザーリテンションとインタラクション機能の概念図\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">図: ミニプログラムのユーザーリテンションとインタラクション機能の概念図</figcaption>\r\n</figure>\r\n    <li><strong>セキュリティを確保する</strong>：ユーザーデータを適切に保護し、情報取得時に目的をユーザーに明確に告知し、<strong>個人情報保護法</strong>などの関連法令を遵守します。</li>\r\n</ul>\r\n\r\n<h3>よくある質問（FAQ）</h3>\r\n<p><strong>Q1: ミニプログラムと通常のアプリ（ネイティブアプリ）の主な違いは何ですか？</strong><br>\r\nA1: 核心的な違いは<strong>インストール方法</strong>にあります。ミニプログラムはアプリストアからダウンロードしてインストールする必要がなく、WeChatなどのアプリ内で検索して利用でき、ユーザーは使用後に離脱できます。一方、ネイティブアプリはダウンロードしてインストールし、スマートフォンのホーム画面に配置する必要があります。これにより、開発コスト、公開サイクル、顧客獲得方法などに一連の違いが生じます。</p>\r\n\r\n<p><strong>Q2: ミニプログラム開発の学習は難しいですか？どのような背景知識が必要ですか？</strong><br>\r\nA2: <strong>HTML</strong>、<strong>CSS</strong>、<strong>JavaScript</strong>などのフロントエンド技術の基礎があれば、習得は非常に速いです。ミニプログラム開発フレームワーク自体は難しくなく、公式ドキュメントやコミュニティリソースも豊富です。初心者は、ミニプログラムのライフサイクル、ページ構造、基本APIを理解することから始めるのが良い方法です。</p>\r\n\r\n<p><strong>Q3: uni-appやTaroなどのクロスプラットフォームフレームワークを使用すると、ネイティブ開発と比べてパフォーマンスが劣りますか？</strong><br>\r\nA3: 大多数のビジネスシーンでは、ユーザーはパフォーマンスの違いを感じません。これらのフレームワークはすでに非常に成熟しており、最終的には各プラットフォームのネイティブコードにコンパイルされます。フレームワークを選択する主な理由は、<strong>開発効率</strong>と<strong>マルチプラットフォーム統一性</strong>のためです。極端にパフォーマンスを追求する場合や、非常に特殊なネイティブコンポーネントを使用する場合にのみ、純粋なネイティブ開発を検討すべきです。</p>\r\n\r\n<p><strong>Q4: ミニプログラムはどのように収益化しますか？</strong><br>\r\nA4: ミニプログラムには多様な収益化モデルがあります。例えば：直接<strong>ECの販売チャネル</strong>として機能する；有料会員や<strong>付加価値サービス</strong>を提供する；<strong>広告</strong>を掲載してトラフィック収入を得る；またはオフラインサービスのオンライン窓口として機能し、ユーザーを店舗での消費に誘導する。核心は、あなたのミニプログラムがユーザーにどのような価値を提供するかによります。</p>','ミニプログラム開発の低コスト、迅速な拡散、ダウンロード・インストール不要といった中核的メリットを理解しましょう。WeChatやAlipayなどのプラットフォームにおけるミニプログラムの開発手順とベストプラクティスを探ります。','','DRAFT','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,0,NULL,0,'2026-01-07 16:31:18.904','2026-01-07 16:41:30.389','[]','[]',0,NULL,'fr','29982c8c-1929-45f5-b831-0c3e3faf75dc'),('f3976ac3-9022-4b1b-9ca1-1b1f1936de7e','Very Good','67769202028-en','\r\n                <h1>Very Good</h1>\r\n                <p>This is an AI-generated draft article about <strong>Very Good</strong>.</p>\r\n<figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767781641420-1767781641420-7o0a6t.png\" alt=\"AI-generated article presented on modern devices\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\">\r\n  <figcaption class=\"mt-3 text-sm text-gray-500 font-medium italic\">Figure: AI-generated article presented on modern devices</figcaption>\r\n</figure>\r\n\r\n                    <h2>What is Very Good?</h2>\r\n                    <p><strong>Very Good</strong> is a..</p>\r\n                <p>...</p>\r\n                <h3>Application Scenarios</h3>\r\n                <p>\r\n</p><figure class=\"my-8 text-center\">\r\n  <img src=\"/uploads/illustrations/illustration-1767781645280-1767781645280-ssn47y.png\" alt=\"Networked display of diverse application scenarios\" class=\"rounded-2xl shadow-xl w-full object-cover max-h-[500px]\"><span style=\"color: rgb(107, 114, 128); font-size: 14px; font-style: italic;\">Figure: Networked display of diverse application scenarios</span></figure>...<p></p>\r\n                <h2>Frequently Asked Questions (FAQ)</h2>\r\n                \r\n                    Q1: ...?\r\n                    A1: ...\r\n                \r\n                <blockquote>\r\n                    <p>This is a simulated AI-generated result (GEO optimized version).</p>\r\n                </blockquote>\r\n            ','\r\n                Very Good\r\n                This is an AI-generated draft article about Very Good.\r\n\r\n                    What is Very Good?\r\n                    Very Good is a...\r\n                \r\n                Main Features\r\n                \r\n                    Feature One','','PUBLISHED','66459764-48bf-49f5-a066-d327ae7a05c9',NULL,0,NULL,0,'2026-01-07 16:29:38.450','2026-01-07 16:29:38.450',NULL,NULL,0,NULL,'en','3c3c157e-6d0a-4d1d-ae28-e1d79c27c31d');
/*!40000 ALTER TABLE `Article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArticleAutomationProject`
--

DROP TABLE IF EXISTS `ArticleAutomationProject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ArticleAutomationProject` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `totalCount` int(11) NOT NULL DEFAULT '1',
  `dailyLimit` int(11) NOT NULL DEFAULT '1',
  `status` enum('ACTIVE','PAUSED','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `enableGeo` tinyint(1) NOT NULL DEFAULT '1',
  `enableIllustrate` tinyint(1) NOT NULL DEFAULT '1',
  `enableAutoLink` tinyint(1) NOT NULL DEFAULT '1',
  `enableCover` tinyint(1) NOT NULL DEFAULT '1',
  `enableSEO` tinyint(1) NOT NULL DEFAULT '1',
  `enableCitations` tinyint(1) NOT NULL DEFAULT '1',
  `enableEntities` tinyint(1) NOT NULL DEFAULT '1',
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `strategyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ArticleAutomationProject_authorId_fkey` (`authorId`),
  KEY `ArticleAutomationProject_categoryId_fkey` (`categoryId`),
  KEY `ArticleAutomationProject_strategyId_fkey` (`strategyId`),
  CONSTRAINT `ArticleAutomationProject_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ArticleAutomationProject_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ArticleAutomationProject_strategyId_fkey` FOREIGN KEY (`strategyId`) REFERENCES `AIStrategy` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticleAutomationProject`
--

LOCK TABLES `ArticleAutomationProject` WRITE;
/*!40000 ALTER TABLE `ArticleAutomationProject` DISABLE KEYS */;
INSERT INTO `ArticleAutomationProject` VALUES ('6dc247d2-d0cc-42cc-b3d2-07664cc75f6d','小程序开发','小程序开发','西仁科技',10,2,'ACTIVE',1,1,1,1,1,1,1,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9','d521e6dd-403a-4f24-ad66-424eef77e7fa','2026-01-11 05:15:02.242','2026-01-11 05:15:02.242');
/*!40000 ALTER TABLE `ArticleAutomationProject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `lang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh',
  `translationGroupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_lang_key` (`slug`,`lang`),
  KEY `Category_lang_idx` (`lang`),
  KEY `Category_translationGroupId_idx` (`translationGroupId`),
  KEY `Category_parentId_fkey` (`parentId`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('156a8465-e5dc-4924-b1f0-5a71a1c22907','科技','articles-en','',NULL,0,'zh',NULL),('274ea848-6365-4b9c-8d71-72fcac25ed54','f','h','',NULL,0,'zh',NULL);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ComponentModule`
--

DROP TABLE IF EXISTS `ComponentModule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ComponentModule` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('HEADER','FOOTER','HOME_PAGE','ARTICLE_PAGE','ABOUT_PAGE','CONTACT_PAGE','PRODUCT_PAGE','SERVICE_PAGE','FAQ_PAGE','CUSTOM_PAGE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `style` longtext COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `order` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ComponentModule`
--

LOCK TABLES `ComponentModule` WRITE;
/*!40000 ALTER TABLE `ComponentModule` DISABLE KEYS */;
/*!40000 ALTER TABLE `ComponentModule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContentAIScore`
--

DROP TABLE IF EXISTS `ContentAIScore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ContentAIScore` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overallScore` double NOT NULL DEFAULT '0',
  `structureScore` double NOT NULL DEFAULT '0',
  `factualScore` double NOT NULL DEFAULT '0',
  `citationScore` double NOT NULL DEFAULT '0',
  `entityScore` double NOT NULL DEFAULT '0',
  `semanticScore` double NOT NULL DEFAULT '0',
  `suggestions` text COLLATE utf8mb4_unicode_ci,
  `analyzedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ContentAIScore_articleId_key` (`articleId`),
  KEY `ContentAIScore_overallScore_idx` (`overallScore`),
  KEY `ContentAIScore_analyzedAt_idx` (`analyzedAt`),
  CONSTRAINT `ContentAIScore_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContentAIScore`
--

LOCK TABLES `ContentAIScore` WRITE;
/*!40000 ALTER TABLE `ContentAIScore` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContentAIScore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContentRecommendation`
--

DROP TABLE IF EXISTS `ContentRecommendation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ContentRecommendation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topicId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimatedTraffic` int(11) NOT NULL DEFAULT '0',
  `difficulty` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `priority` int(11) NOT NULL DEFAULT '0',
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ContentRecommendation_topicId_idx` (`topicId`),
  KEY `ContentRecommendation_priority_idx` (`priority`),
  KEY `ContentRecommendation_status_idx` (`status`),
  KEY `ContentRecommendation_createdAt_idx` (`createdAt`),
  CONSTRAINT `ContentRecommendation_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `TrendingTopic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContentRecommendation`
--

LOCK TABLES `ContentRecommendation` WRITE;
/*!40000 ALTER TABLE `ContentRecommendation` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContentRecommendation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CrawlerBehavior`
--

DROP TABLE IF EXISTS `CrawlerBehavior`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CrawlerBehavior` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `crawler` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avgVisitHour` int(11) NOT NULL DEFAULT '0',
  `peakHours` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferredPaths` text COLLATE utf8mb4_unicode_ci,
  `avgDepth` double NOT NULL DEFAULT '0',
  `visitFrequency` double NOT NULL DEFAULT '0',
  `lastAnalyzed` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CrawlerBehavior_crawler_key` (`crawler`),
  KEY `CrawlerBehavior_lastAnalyzed_idx` (`lastAnalyzed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CrawlerBehavior`
--

LOCK TABLES `CrawlerBehavior` WRITE;
/*!40000 ALTER TABLE `CrawlerBehavior` DISABLE KEYS */;
INSERT INTO `CrawlerBehavior` VALUES ('2584b14b-c49d-4a4f-b18f-c823552e5f97','yisouspider',16,'[16]','[\"/robots.txt\"]',0,1,'2026-01-09 13:30:17.611'),('5f5ee5c2-9f53-4196-978e-8afb23080fa0','oai-searchbot',12,'[11,12,3]','[\"/robots.txt\"]',0,3.025005518709432,'2026-01-09 13:30:17.347'),('69ae5f00-8e63-494a-aadd-0fbef9fc5d2d','360spider',1,'[1,2,0]','[\"/\"]',0,2.729259861921089,'2026-01-09 13:30:16.581'),('eae96114-366d-4a53-903a-89cc1ab8736d','bytespider',17,'[8,19,20]','[\"/robots.txt\",\"/sitemap.xml\"]',0,3.873756864233273,'2026-01-09 13:30:16.835'),('fdcb96cd-cb12-4f70-bca8-2c7e0fc061e3','gptbot',16,'[23,11,12]','[\"/\",\"/category/articles-en\",\"/articles/67769202028\",\"/articles/dfghj\",\"/articles/mini-program-development-guide-advantages-steps-platforms\"]',0,8.642376077262842,'2026-01-09 13:30:17.093');
/*!40000 ALTER TABLE `CrawlerBehavior` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CrawlerLog`
--

DROP TABLE IF EXISTS `CrawlerLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CrawlerLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `crawler` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userAgent` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusCode` int(11) NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAbnormal` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CrawlerLog_crawler_idx` (`crawler`),
  KEY `CrawlerLog_createdAt_idx` (`createdAt`),
  KEY `CrawlerLog_path_idx` (`path`),
  KEY `CrawlerLog_isAbnormal_idx` (`isAbnormal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CrawlerLog`
--

LOCK TABLES `CrawlerLog` WRITE;
/*!40000 ALTER TABLE `CrawlerLog` DISABLE KEYS */;
INSERT INTO `CrawlerLog` VALUES ('0185988d-e68a-4e09-a1c4-7e9a1cac262b','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/robots.txt',200,'44.217.177.142','',0,'2026-01-10 20:32:49.869'),('020b6831-9955-4b13-812a-14b974879dca','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.61','https://113ai.com',0,'2026-01-06 17:09:43.393'),('03e5bca7-670b-4f8d-af7e-a43365d7b140','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/robots.txt',200,'110.249.202.97','',0,'2026-01-06 11:32:16.808'),('047593cc-9bd8-4694-bfa5-f37dbfa9ab54','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.228.24','',0,'2026-01-09 03:07:15.874'),('048e5bca-7565-4d94-b420-3143fc0c1b01','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/',200,'74.7.243.131','',0,'2026-01-07 03:45:46.983'),('04d5d3e8-b9e5-4d8a-9f8c-261cca39e961','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.13','https://113ai.com/',0,'2026-01-07 18:55:53.932'),('068075c3-1090-419b-a90e-5de938b9964e','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/login',200,'100.29.160.53','',0,'2026-01-11 05:15:40.893'),('06e6d699-a0b1-4421-87f9-6ffe46c31079','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.200','https://113ai.com/',0,'2026-01-05 18:38:45.887'),('09d26620-2e59-46e0-a4d7-7cac851fab6d','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/dfghj',200,'74.7.227.37','',0,'2026-01-09 04:57:54.793'),('0a90557b-f53f-4d7c-ba69-240b8893e42b','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/cases',200,'74.7.243.131','',0,'2026-01-07 03:46:05.563'),('0e4c65dd-a9e8-4e72-9181-0e3bb7757027','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/articles/mini-program-development-guide-advantages-steps-platforms',200,'184.73.35.182','',0,'2026-01-11 21:15:30.202'),('0f470eeb-3bcd-411b-af0c-086b5a175f87','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/pricing',200,'52.70.123.241','',0,'2026-01-11 12:02:12.539'),('0ff58e4f-23d8-4ba6-ba89-99961c8370ae','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.230.16','',0,'2026-01-09 13:50:31.569'),('1045bc6a-cf3c-45cf-b2a3-8030d004d778','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/1767766802031',200,'74.7.227.41','',0,'2026-01-08 15:07:08.597'),('1a6f003e-2cbe-4214-ae25-9bd713214600','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/get-started',200,'34.204.150.196','',0,'2026-01-11 07:50:53.073'),('1dbb1e63-747b-4483-b6ab-f132d06ded1b','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.151','https://113ai.com/',0,'2026-01-08 16:59:41.361'),('215a4481-70d8-490e-b1ba-5189a3793560','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/mini-program-development-guide-advantages-steps-platforms',200,'74.7.227.41','',0,'2026-01-08 15:07:12.959'),('23d32dd6-ffe4-45ec-a205-1a9dc9075a8b','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'111.225.149.57','',0,'2026-01-07 12:32:11.362'),('242b03ae-4358-46de-9dbd-18ae33b6a5aa','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/mini-program-development-guide-advantages-steps-platforms',200,'74.7.227.37','',0,'2026-01-09 04:57:45.058'),('2a764b7f-d040-4beb-8547-664738fa89a6','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.46','https://113ai.com',0,'2026-01-09 18:25:54.156'),('2de7fe05-2da5-4683-9ffa-97140d4d31fc','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/articles/67769202028',200,'44.206.65.8','',0,'2026-01-11 13:04:07.844'),('2ecda4df-7df5-4e09-b526-ba80c59f32fa','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/docs',200,'52.200.93.170','',0,'2026-01-11 20:13:58.990'),('30bf0be7-404b-45b6-a235-d2c44fe16699','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.59','https://113ai.com',0,'2026-01-07 17:22:45.885'),('375b9991-f832-4ce8-80ea-c7ee885a4300','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.175.182','',0,'2026-01-07 03:45:44.923'),('3a8b0eaf-2c5a-4fa3-a686-d637b55fbc34','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/67769202028',200,'74.7.227.37','',0,'2026-01-09 04:57:56.827'),('4163426f-4f9b-408e-8d3c-484f6a847062','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.228.26','',0,'2026-01-07 19:20:18.498'),('423bd2bd-a3d7-4677-9801-60f7184ac717','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/fghj',200,'74.7.243.131','',0,'2026-01-07 03:45:59.335'),('44c9ecff-cb71-4ee7-bb1c-e21080a90a79','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/features',200,'54.89.90.224','',0,'2026-01-11 03:35:00.108'),('480daff2-a986-4b06-816f-e2543bd0081e','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/services',200,'98.83.94.113','',0,'2026-01-11 05:52:21.587'),('48bdfd67-dd94-469f-8935-7fbf34f92269','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/robots.txt',200,'110.249.201.220','',0,'2026-01-11 14:35:56.319'),('4a0200fa-85a3-4762-9004-df4dc0f05cac','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/67769202028',200,'74.7.227.41','',0,'2026-01-08 15:06:55.697'),('4a6aa63f-d326-48bb-b257-5f76be74a371','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.241.166','',0,'2026-01-05 23:31:12.606'),('4b76c1ef-242e-4e02-b792-47e5a03c9fcf','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/about',200,'52.73.142.41','',0,'2026-01-11 09:23:13.335'),('515a7626-2857-4bd6-8032-c058af77c03e','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.241.166','',0,'2026-01-06 10:18:39.384'),('525e85a5-e560-4523-9492-4bbf6003e221','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.61','https://113ai.com/',0,'2026-01-06 17:10:20.498'),('574904cd-a104-4070-9c9f-b856b7fac9b6','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.23','https://113ai.com',0,'2026-01-10 17:01:08.820'),('592870ed-ec36-4128-b4ac-e54a1368668d','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.228.24','',0,'2026-01-09 13:10:05.664'),('5f5af97d-7973-45f3-bb98-993233a09c10','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.151','https://113ai.com/',0,'2026-01-10 17:01:09.869'),('67fdfcdd-feda-498b-8db5-7a06cc940b1b','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/login',200,'74.7.243.131','',0,'2026-01-07 03:45:54.882'),('6a299968-04b4-4c01-a8e3-8297afd9fb35','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'110.249.202.52','',0,'2026-01-10 14:02:13.013'),('6b912e3d-9a14-44b7-8bff-4bb66fe3f110','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.35','https://113ai.com',0,'2026-01-11 22:17:06.426'),('6ec711e4-fff3-4c76-b9a4-31137557bf19','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'110.249.202.187','',0,'2026-01-09 13:32:04.055'),('6fa0ba06-3fb2-4efc-9ebe-ffbd5199730e','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/category/articles-en',200,'74.7.227.37','',0,'2026-01-09 04:58:01.247'),('783ac95d-6e86-4d0b-b14c-1189ce5e5510','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/robots.txt',200,'44.205.120.22','',0,'2026-01-11 21:15:26.106'),('7c1bf337-7256-4fed-a66a-0f8d11b85065','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.230.16','',0,'2026-01-09 04:57:28.750'),('8b5f214f-a3df-4d36-a243-660d5c268d85','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'111.225.148.147','',0,'2026-01-06 11:32:16.826'),('8d58d6a5-a461-4fe8-9845-604969def3e2','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/',200,'74.7.227.37','',0,'2026-01-09 04:57:28.320'),('8e9e4516-5f0a-425b-ad53-fba04ac5a091','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/',200,'74.7.241.22','',0,'2026-01-06 10:19:07.231'),('911b7343-a785-4808-93d7-552b3971718c','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.247','https://113ai.com',0,'2026-01-05 18:38:48.459'),('98122138-0461-4ac3-bb88-8bc073a4246c','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/1767766802031',200,'74.7.227.37','',0,'2026-01-09 04:57:41.026'),('99ef7fb6-8747-48e7-8a1d-ea30aa4f24e3','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.228.24','',0,'2026-01-08 15:06:16.049'),('9bb07abb-0bfb-4604-a3bb-ae96ffcab652','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/robots.txt',200,'110.249.202.4','',0,'2026-01-07 12:32:14.452'),('9f3cc52a-4a05-401a-982c-b076e8d35a65','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'110.249.201.208','',0,'2026-01-07 00:02:56.191'),('a24562d2-82dd-4fdd-bd22-af5839e2f34d','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/careers',200,'54.92.171.106','',0,'2026-01-11 09:23:10.617'),('a2dd5abe-f68e-48c6-9ef6-62dd153b4b4f','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/articles/fghj',200,'34.235.239.240','',0,'2026-01-11 08:58:11.224'),('a61fe5a3-02a9-4ea1-be24-444572c9d1ce','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/',200,'74.7.227.41','',0,'2026-01-08 15:06:44.945'),('a81a2053-c707-4214-bdfa-2c2c9c3cfddf','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.136','https://113ai.com/',0,'2026-01-09 18:25:55.288'),('a820b21b-cc11-41a4-9678-23c0b8861472','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/robots.txt',200,'110.249.202.92','',0,'2026-01-08 13:06:08.244'),('a99c9dd4-5614-48ec-aa4d-bf53bb538cc1','yisouspider','YisouSpider','/robots.txt',200,'124.239.12.60','',0,'2026-01-07 08:40:20.757'),('ab174622-eac5-438d-9415-df4ad2da8c18','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.228.26','',0,'2026-01-07 04:40:19.491'),('b0e98fe3-35e6-4c72-910d-f55d10d3132d','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'110.249.202.132','',0,'2026-01-11 14:31:59.422'),('b104cf13-113d-4ef2-b431-fe27f63bec92','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.175.172','',0,'2026-01-10 00:44:39.876'),('b1d0cc0c-6bd7-434b-a78e-7f13632dfce6','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/category/articles-en',200,'74.7.227.41','',0,'2026-01-08 15:07:29.320'),('b50adab9-c98a-4323-ac7f-4d6bc46f33ca','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/sitemap.xml',200,'110.249.202.164','',0,'2026-01-08 13:02:11.686'),('bb58ed77-f5ab-4e5c-9d93-86e2a195ab44','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/products',200,'52.45.77.169','',0,'2026-01-11 11:31:00.432'),('bde1ca2b-d18f-432a-a559-fdc196e663c0','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/',200,'34.234.200.207','',0,'2026-01-10 20:32:53.100'),('c0108a97-0d3c-4a18-9570-0eabe9d1dc25','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/contact',200,'3.220.148.166','',0,'2026-01-11 08:58:04.262'),('c58f2170-04ba-4161-aaa0-9ffe22a71f83','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/fghj',200,'74.7.227.41','',0,'2026-01-08 15:06:57.337'),('c6319d73-9fce-4ae4-ac0a-8bab76e73df6','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/category/articles-en',200,'23.23.214.190','',0,'2026-01-12 09:35:28.300'),('c648366f-2af2-464d-bcef-cc46a0974c69','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/articles/1767766802031',200,'3.210.223.61','',0,'2026-01-11 13:47:10.983'),('d7ab87df-2efc-413c-a2b8-92b225e21e50','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.230.55','',0,'2026-01-05 21:53:44.419'),('d854a25d-f861-4489-9937-a9c3ebe67033','bytespider','Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)','/robots.txt',200,'111.225.149.98','',0,'2026-01-07 00:02:56.179'),('d8a95aec-43e0-4632-82b0-06e45d5bb0c8','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/articles',200,'50.19.102.70','',0,'2026-01-11 13:04:04.621'),('dae2cff3-3742-4dba-9f46-6dd34aaeda8f','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/services',200,'74.7.243.131','',0,'2026-01-07 03:45:52.336'),('e1e82fd8-8de0-42cd-ae7f-38bc3fe9b9aa','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/cases',200,'74.7.227.41','',0,'2026-01-08 15:07:04.482'),('e80b61a1-e569-4d18-a181-8d055243361e','oai-searchbot','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.3; robots.txt; +https://openai.com/searchbot','/robots.txt',200,'74.7.175.182','',0,'2026-01-07 20:07:25.041'),('e851961d-6d0c-4fb3-adf6-d54b43bb1c8e','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.44','https://113ai.com/',0,'2026-01-11 22:16:51.998'),('edc57291-5989-4bfc-ac2b-ea715a107a85','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/articles/dfghj',200,'74.7.227.41','',0,'2026-01-08 15:07:06.018'),('ede6ac82-5fb4-4c63-9841-3298fc881318','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/services',200,'74.7.227.41','',0,'2026-01-08 15:07:03.359'),('f00872f9-d4bb-4195-917d-50b408a45bc4','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/pricing',200,'74.7.243.131','',0,'2026-01-07 03:46:01.238'),('f121bfd4-c7fd-4e7c-b727-bc7793cfbd85','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/cases',200,'52.200.93.170','',0,'2026-01-11 06:47:58.390'),('f915601a-da2e-41d8-b0a9-b6942985b5a3','360spider','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0; 360Spider','/',200,'180.153.236.26','https://113ai.com',0,'2026-01-08 16:59:40.521'),('f994d97e-44a8-4279-b397-eab9510aa7fd','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/docs',200,'74.7.243.131','',0,'2026-01-07 03:46:06.907'),('fe9135f7-1ae5-4e42-93dd-b9273cc81c1a','amazonbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot) Chrome/119.0.6045.214 Safari/537.36','/register',200,'52.54.15.103','',0,'2026-01-12 14:35:04.275'),('ff3720b7-210f-4471-8757-2a867fcd465a','gptbot','Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.3; +https://openai.com/gptbot)','/features',200,'74.7.243.131','',0,'2026-01-07 03:46:02.825');
/*!40000 ALTER TABLE `CrawlerLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `File` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storageKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int(11) NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folder` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `uploadedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `File_category_idx` (`category`),
  KEY `File_uploadedById_idx` (`uploadedById`),
  KEY `File_createdAt_idx` (`createdAt`),
  KEY `File_storageId_fkey` (`storageId`),
  CONSTRAINT `File_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `StorageConfig` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `File_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File`
--

LOCK TABLES `File` WRITE;
/*!40000 ALTER TABLE `File` DISABLE KEYS */;
INSERT INTO `File` VALUES ('129be173-9d19-4c24-a1af-b7d1347c49cd','illustration-1767781360245.png','illustrations/illustration-1767781360245-1767781360245-bxq2xv.png','image/png',3772,'/uploads/illustrations/illustration-1767781360245-1767781360245-bxq2xv.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 10:22:40.249','2026-01-07 10:22:40.249','Illustration for: 很好'),('18dc3f16-a52e-401f-ae79-9db03d121358','u=501690572,940651417&fm=253&app=138&f=JPEG.jpg','67fc534e-3a2c-414e-996a-800a358a6f38-1767795530705-i3l0va.jpg','image/jpeg',127145,'/uploads/67fc534e-3a2c-414e-996a-800a358a6f38-1767795530705-i3l0va.jpg','image',NULL,1067,800,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:18:50.830','2026-01-07 14:18:50.830',NULL),('2b458ad1-a875-4d99-9021-9a1806f3f2fe','jpglogo1025.png','abdbe5e2-0eb2-410f-8e37-51ff4cfecabc-1767796536442-wlp3cc.png','image/png',356867,'/uploads/abdbe5e2-0eb2-410f-8e37-51ff4cfecabc-1767796536442-wlp3cc.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:35:36.535','2026-01-07 14:35:36.535',NULL),('3610920d-8797-440e-bd6b-7e54917291c1','ZzkauYFa7rlK5c80e7f5df906a88be790932d3fc1f11.png','1efdfa3c-90df-44eb-81d1-d386ed86b95d-1767795553763-6i492h.png','image/png',256540,'/uploads/1efdfa3c-90df-44eb-81d1-d386ed86b95d-1767795553763-6i492h.png','image',NULL,508,574,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:19:13.844','2026-01-07 14:19:13.844',NULL),('679e0cae-d3e7-47b0-9954-039ed53c3865','jpglogo1025.png','1640b2fa-d967-40db-8a6b-a73ec8001424-1767796347415-5bcnow.png','image/png',356867,'/uploads/1640b2fa-d967-40db-8a6b-a73ec8001424-1767796347415-5bcnow.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:32:27.536','2026-01-07 14:32:27.536',NULL),('6f807c4a-ad20-4b6c-beb9-7f43a3f1e9d4','jpglogo1025.png','d8534318-937d-4b0c-8a2b-21e58f622388-1767796896013-0new4d.png','image/png',356867,'/uploads/d8534318-937d-4b0c-8a2b-21e58f622388-1767796896013-0new4d.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:41:36.154','2026-01-07 14:41:36.154',NULL),('7526b6ba-b1ee-46f2-bac5-89b150e7225b','illustration-1767794377218.png','illustrations/illustration-1767794377218-1767794377218-46eioj.png','image/png',3097,'/uploads/illustrations/illustration-1767794377218-1767794377218-46eioj.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 13:59:37.222','2026-01-07 13:59:37.222','Illustration for: 很好'),('80bce615-7322-4f46-81db-8acffa75b781','021765732582282ea04a1f569f2c68838594c7fa0bbe124eb238f_0.jpeg','95edc29d-8955-4f3c-a4a1-f5cc67811330-1767796222411-3fzwxx.jpeg','image/jpeg',222036,'/uploads/95edc29d-8955-4f3c-a4a1-f5cc67811330-1767796222411-3fzwxx.jpeg','image',NULL,3136,1344,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:30:22.543','2026-01-07 14:30:22.543',NULL),('81500e36-628d-40eb-9b1f-c5352b5c3497','jpglogo1025.png','2a9102be-b96f-43fd-84b9-d0443e371485-1767796807262-ok7250.png','image/png',356867,'/uploads/2a9102be-b96f-43fd-84b9-d0443e371485-1767796807262-ok7250.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:40:07.363','2026-01-07 14:40:07.363',NULL),('a6f62fbd-49b3-41b9-a321-c9d908f741bf','illustration-1767794379129.png','illustrations/illustration-1767794379129-1767794379129-agvu4p.png','image/png',3097,'/uploads/illustrations/illustration-1767794379129-1767794379129-agvu4p.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 13:59:39.132','2026-01-07 13:59:39.132','Illustration for: 很好'),('cf75b667-799f-4d8a-856d-21226f505094','illustration-1767781645280.png','illustrations/illustration-1767781645280-1767781645280-ssn47y.png','image/png',3772,'/uploads/illustrations/illustration-1767781645280-1767781645280-ssn47y.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 10:27:25.283','2026-01-07 10:27:25.283','Illustration for: 很好'),('d24fe28a-02fb-4317-8ac4-8cfa31d4421a','40deafd9e90e4d618c22151d52a05fe2~tplv-13w3uml6bg-image.jpeg','1dfc631f-85b5-4df0-b8eb-85e7f46971d4-1767795927557-ngyt49.jpeg','image/jpeg',253421,'/uploads/1dfc631f-85b5-4df0-b8eb-85e7f46971d4-1767795927557-ngyt49.jpeg','image',NULL,3200,1800,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:25:27.736','2026-01-07 14:25:27.736',NULL),('ec371f7c-fcd0-4363-a660-7e665db03117','illustration-1767781362211.png','illustrations/illustration-1767781362211-1767781362212-5v0rwa.png','image/png',3772,'/uploads/illustrations/illustration-1767781362211-1767781362212-5v0rwa.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 10:22:42.216','2026-01-07 10:22:42.216','Illustration for: 很好'),('eceea457-09e4-40e7-a15e-552f1ef7f21c','illustration-1767781641420.png','illustrations/illustration-1767781641420-1767781641420-7o0a6t.png','image/png',3772,'/uploads/illustrations/illustration-1767781641420-1767781641420-7o0a6t.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 10:27:21.425','2026-01-07 10:27:21.425','Illustration for: 很好'),('f44d5c74-978b-465b-a2c3-de48aa9e5239','jpglogo1025.png','26e373fb-3a80-469c-8a79-559493d7e8e0-1767796233652-0klz2n.png','image/png',356867,'/uploads/26e373fb-3a80-469c-8a79-559493d7e8e0-1767796233652-0klz2n.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:30:33.743','2026-01-07 14:30:33.743',NULL),('f4f1c824-c28b-4b48-a5c4-86fb1b2afbd9','illustration-1767781643394.png','illustrations/illustration-1767781643394-1767781643394-blj8fx.png','image/png',3772,'/uploads/illustrations/illustration-1767781643394-1767781643394-blj8fx.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 10:27:23.399','2026-01-07 10:27:23.399','Illustration for: 很好'),('f83e0e17-b8ad-4fce-90c3-ea83c0803ea1','illustration-1767794375185.png','illustrations/illustration-1767794375185-1767794375186-g7p530.png','image/png',3097,'/uploads/illustrations/illustration-1767794375185-1767794375186-g7p530.png','image',NULL,NULL,NULL,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 13:59:35.190','2026-01-07 13:59:35.190','Illustration for: 很好'),('ff899146-6a2b-415d-a72f-067dd8efac5e','jpglogo1025.png','1ce14962-e0b7-4aa4-a797-39e6dd6caf2e-1767797003727-xmasrw.png','image/png',356867,'/uploads/1ce14962-e0b7-4aa4-a797-39e6dd6caf2e-1767797003727-xmasrw.png','image',NULL,1025,1025,NULL,'66459764-48bf-49f5-a066-d327ae7a05c9',NULL,'2026-01-07 14:43:23.863','2026-01-07 14:43:23.863',NULL);
/*!40000 ALTER TABLE `File` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Message` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Message_isRead_idx` (`isRead`),
  KEY `Message_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PAID','SHIPPED','COMPLETED','CANCELLED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `customerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customerEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customerPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingAddress` text COLLATE utf8mb4_unicode_ci,
  `note` text COLLATE utf8mb4_unicode_ci,
  `paidAt` datetime(3) DEFAULT NULL,
  `shippedAt` datetime(3) DEFAULT NULL,
  `completedAt` datetime(3) DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  KEY `Order_orderNumber_idx` (`orderNumber`),
  KEY `Order_userId_idx` (`userId`),
  KEY `Order_status_idx` (`status`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OrderItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `productName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productSku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `attributes` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_idx` (`orderId`),
  KEY `OrderItem_productId_idx` (`productId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItem`
--

LOCK TABLES `OrderItem` WRITE;
/*!40000 ALTER TABLE `OrderItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Page` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('HOME','ARTICLE_LIST','PRODUCT_LIST','ABOUT','CONTACT','CUSTOM','HEADER','FOOTER','GENERAL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOM',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED','SCHEDULED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `templateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `footerTemplateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headerTemplateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sections` json DEFAULT NULL,
  `editorMode` enum('VISUAL','CODE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh',
  `translationGroupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Page_slug_lang_key` (`slug`,`lang`),
  KEY `Page_lang_idx` (`lang`),
  KEY `Page_translationGroupId_idx` (`translationGroupId`),
  KEY `Page_isDefault_idx` (`isDefault`),
  KEY `Page_footerTemplateId_fkey` (`footerTemplateId`),
  KEY `Page_headerTemplateId_fkey` (`headerTemplateId`),
  KEY `Page_templateId_fkey` (`templateId`),
  CONSTRAINT `Page_footerTemplateId_fkey` FOREIGN KEY (`footerTemplateId`) REFERENCES `PageTemplate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Page_headerTemplateId_fkey` FOREIGN KEY (`headerTemplateId`) REFERENCES `PageTemplate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Page_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `PageTemplate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
INSERT INTO `Page` VALUES ('100fdbac-18cf-4178-81dd-0c4ff0b3f800','page-1767766491400','','CUSTOM','2026-01-07 06:14:51.533','2026-01-07 16:25:58.472','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','e21a9fc8-48a2-4472-95a3-ccf51b289047',0),('1b411b60-5bb9-4b61-afb4-726154d7576e','page-1767792707915-en','','CUSTOM','2026-01-07 16:26:14.854','2026-01-07 16:26:14.854','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','5e0c6cd6-5c66-4141-80aa-dc79ba4135a2',0),('31cfdb9b-72de-44a4-9dc0-a27de0de6ac2','home','','CUSTOM','2026-01-05 17:09:13.116','2026-01-07 16:25:58.809','PUBLISHED',NULL,'首页',NULL,NULL,NULL,NULL,'zh','9df8e441-5c38-48ed-bbc9-1a60325e6ad0',0),('395d36bc-866f-403d-a919-21fd33bcd0a0','homez','','HOME','2026-01-11 10:46:23.406','2026-01-11 10:46:23.406','PUBLISHED','ec25d29c-876d-4987-bc8b-dd5ecf73b612','首页',NULL,NULL,NULL,NULL,'zh',NULL,1),('65c43cde-c8b6-486d-8c15-7e1e638de1ef','page-1767766281767-en','','CUSTOM','2026-01-07 16:26:10.618','2026-01-07 16:26:10.618','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','416a4c88-c0fe-463e-9408-b29743fa26c0',0),('6a41e22a-68a3-4a94-99fa-f71fc9367907','page-1767766280350-en','','CUSTOM','2026-01-07 16:26:06.324','2026-01-07 16:26:06.324','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','2a5375d6-ed2c-4d27-a968-bcf8e3191df6',0),('7b0d7a74-456c-43c6-ad3e-33a1dec38102','page-1767766280350','','CUSTOM','2026-01-07 06:11:20.596','2026-01-07 16:25:59.021','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','2a5375d6-ed2c-4d27-a968-bcf8e3191df6',0),('7ccb0af9-324e-4d69-9de0-a78472d49338','page-1767766282516-en','','CUSTOM','2026-01-07 16:26:12.588','2026-01-07 16:26:12.588','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','73be9c05-54ad-4b3f-8b1a-1bc77e1faa49',0),('973c1c5d-02d3-42ab-8b8b-5809a549b094','home-en','','CUSTOM','2026-01-07 16:26:03.931','2026-01-07 16:26:03.931','PUBLISHED',NULL,'Home',NULL,NULL,NULL,NULL,'en','9df8e441-5c38-48ed-bbc9-1a60325e6ad0',0),('9f85364b-1086-42ac-9350-010770435e54','page-1767766491400-en','','CUSTOM','2026-01-07 16:26:01.649','2026-01-07 16:26:01.649','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','e21a9fc8-48a2-4472-95a3-ccf51b289047',0),('a4a3d577-5cf5-4a5f-8327-59d5ef2234e3','page-1767792708882','','CUSTOM','2026-01-07 13:31:48.939','2026-01-07 16:25:59.232','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','b10bedbf-9f1f-4137-b0b7-8e75e188022e',0),('b7debe85-aa9b-4eb1-ad51-32570309fb57','page-1767792708882-en','','CUSTOM','2026-01-07 16:26:08.300','2026-01-07 16:26:08.300','DRAFT',NULL,'New Page',NULL,NULL,NULL,NULL,'en','b10bedbf-9f1f-4137-b0b7-8e75e188022e',0),('caa591c7-cbf1-40d2-b368-2bb8e029d0aa','page-1767766281767','','CUSTOM','2026-01-07 06:11:21.821','2026-01-07 16:25:59.440','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','416a4c88-c0fe-463e-9408-b29743fa26c0',0),('cfcdf600-2e85-456f-8db1-9fa087dfe719','page-1767766282516','','CUSTOM','2026-01-07 06:11:22.570','2026-01-07 16:25:59.649','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','73be9c05-54ad-4b3f-8b1a-1bc77e1faa49',0),('df4bdbab-734b-4829-b62e-03e1a9925c4d','page-1767792707915','','CUSTOM','2026-01-07 13:31:48.247','2026-01-07 16:25:59.858','DRAFT',NULL,'新页面',NULL,NULL,'null','VISUAL','zh','5e0c6cd6-5c66-4141-80aa-dc79ba4135a2',0);
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageTemplate`
--

DROP TABLE IF EXISTS `PageTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PageTemplate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `style` longtext COLLATE utf8mb4_unicode_ci,
  `type` enum('HOME','ARTICLE_LIST','PRODUCT_LIST','ABOUT','CONTACT','CUSTOM','HEADER','FOOTER','GENERAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `moduleType` enum('HEADER','FOOTER','HOME_PAGE','ARTICLE_PAGE','ABOUT_PAGE','CONTACT_PAGE','PRODUCT_PAGE','SERVICE_PAGE','FAQ_PAGE','CUSTOM_PAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HOME_PAGE',
  `preview` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `sections` json DEFAULT NULL,
  `isAIGenerated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageTemplate`
--

LOCK TABLES `PageTemplate` WRITE;
/*!40000 ALTER TABLE `PageTemplate` DISABLE KEYS */;
INSERT INTO `PageTemplate` VALUES ('8c6083dd-e65c-4b83-a87d-c02944ab1c32','等等',NULL,'',NULL,'CUSTOM',0,'2026-01-06 19:41:01.698','2026-01-06 19:41:01.698',0,'HEADER',NULL,1,'[{\"id\": \"5272d6ff-7aec-4ee6-b4db-ddd837d51ef7\", \"data\": {\"logoText\": \"TwoRow\", \"navItems\": [{\"link\": \"/\", \"label\": \"首页\"}, {\"link\": \"/products\", \"label\": \"产品\"}, {\"link\": \"/services\", \"label\": \"服务\"}, {\"link\": \"/cases\", \"label\": \"案例\"}, {\"link\": \"/about\", \"label\": \"关于\"}], \"ctaButtonLink\": \"/get-started\", \"ctaButtonText\": \"联系我们\", \"ctaButtonColor\": \"#2563eb\", \"ctaButtonTextColor\": \"#ffffff\"}, \"type\": \"header\", \"style\": {\"height\": \"h-auto\", \"layout\": \"stacked\", \"sticky\": \"sticky top-0\", \"textColor\": \"#1f2937\", \"backgroundColor\": \"#ffffff\"}}]',0),('ec25d29c-876d-4987-bc8b-dd5ecf73b612','首页',NULL,'',NULL,'CUSTOM',0,'2026-01-11 10:38:18.606','2026-01-11 15:13:01.795',0,'HOME_PAGE',NULL,1,'[{\"id\": \"03193570-4582-4a5f-af31-747001938255\", \"data\": {\"title\": \"赢得百万用户的信赖\", \"btnText\": \"免费开始\", \"partners\": [{\"logo\": \"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg\", \"name\": \"Google\"}, {\"logo\": \"https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg\", \"name\": \"Microsoft\"}, {\"logo\": \"https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg\", \"name\": \"Spotify\"}, {\"logo\": \"https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg\", \"name\": \"Airbnb\"}], \"proofTitle\": \"他们都在使用 企业官网\", \"description\": \"我们为全球最挑剔的企业提供稳定、安全、高效的基础设施服务。\", \"isMainTitle\": true}, \"type\": \"hero-15\", \"style\": {\"textColor\": \"#111827\", \"accentColor\": \"#3b82f6\", \"backgroundColor\": \"#ffffff\"}}, {\"id\": \"e8985a08-077e-4ebd-94c5-dcdc465fe492\", \"data\": {\"steps\": [{\"title\": \"注册账号\", \"subtitle\": \"快速注册\", \"description\": \"填写基本信息，创建您的专属账号\"}, {\"title\": \"配置设置\", \"subtitle\": \"个性化\", \"description\": \"根据需求配置系统参数和偏好\"}, {\"title\": \"开始使用\", \"subtitle\": \"立即体验\", \"description\": \"一切准备就绪，开启全新体验\"}], \"title\": \"我们的流程\", \"subtitle\": \"简单三步，轻松完成\"}, \"type\": \"process-01\", \"style\": {\"textColor\": \"#111827\", \"accentColor\": \"#3b82f6\", \"completedColor\": \"#10b981\", \"backgroundColor\": \"#f0f9ff\"}}, {\"id\": \"aee70977-34c1-44e3-ad1a-9eb3fafa3c94\", \"data\": {\"title\": \"准备好开始了吗？\", \"subtitle\": \"立即加入我们，开启您的数字化转型之旅\", \"buttonUrl\": \"#\", \"buttonText\": \"免费试用\"}, \"type\": \"cta-01\", \"style\": {\"textColor\": \"#ffffff\", \"accentColor\": \"#1d4ed8\", \"backgroundColor\": \"#3b82f6\"}}, {\"id\": \"2454198e-8633-4f6a-9f89-e4b992763a2f\", \"data\": {\"title\": \"精选内容\", \"pageSize\": 5, \"showDate\": true, \"subtitle\": \"\", \"showImage\": true, \"showCategory\": true, \"featuredLayout\": true, \"showPagination\": true, \"showDescription\": true, \"categorySortOrder\": \"\"}, \"type\": \"article-list-03\", \"style\": {\"textColor\": \"#111827\", \"accentColor\": \"#ef4444\", \"backgroundColor\": \"#f9fafb\", \"cardBackgroundColor\": \"#ffffff\"}}, {\"id\": \"6f1c59ca-e72e-460a-9169-4e5c7945a2cd\", \"data\": {\"title\": \"限时特惠\", \"subtitle\": \"优惠即将结束\", \"buttonUrl\": \"#\", \"buttonText\": \"立即抢购\", \"targetDate\": \"2026-01-14T10:47:02.209Z\"}, \"type\": \"countdown-02\", \"style\": {\"textColor\": \"#f1f5f9\", \"accentColor\": \"#f59e0b\", \"backgroundColor\": \"#0f172a\"}}]',0);
/*!40000 ALTER TABLE `PageTemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `comparePrice` decimal(10,2) DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImage` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `specifications` json DEFAULT NULL,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDescription` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED','SCHEDULED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `viewCount` int(11) NOT NULL DEFAULT '0',
  `salesCount` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `lang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh',
  `translationGroupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_lang_key` (`slug`,`lang`),
  UNIQUE KEY `Product_sku_key` (`sku`),
  KEY `Product_slug_lang_idx` (`slug`,`lang`),
  KEY `Product_lang_idx` (`lang`),
  KEY `Product_translationGroupId_idx` (`translationGroupId`),
  KEY `Product_categoryId_idx` (`categoryId`),
  KEY `Product_status_idx` (`status`),
  KEY `Product_isFeatured_idx` (`isFeatured`),
  KEY `Product_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ProductCategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductCategory`
--

DROP TABLE IF EXISTS `ProductCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ProductCategory` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `lang` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh',
  `translationGroupId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductCategory_slug_lang_key` (`slug`,`lang`),
  KEY `ProductCategory_slug_lang_idx` (`slug`,`lang`),
  KEY `ProductCategory_lang_idx` (`lang`),
  KEY `ProductCategory_translationGroupId_idx` (`translationGroupId`),
  KEY `ProductCategory_parentId_idx` (`parentId`),
  CONSTRAINT `ProductCategory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ProductCategory` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductCategory`
--

LOCK TABLES `ProductCategory` WRITE;
/*!40000 ALTER TABLE `ProductCategory` DISABLE KEYS */;
INSERT INTO `ProductCategory` VALUES ('82cac46a-d5b0-4520-937c-65acfe211dc2','h','h','',NULL,1,1,'2026-01-07 17:26:54.865','2026-01-07 17:27:20.726','zh',NULL);
/*!40000 ALTER TABLE `ProductCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SEOPushConfig`
--

DROP TABLE IF EXISTS `SEOPushConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SEOPushConfig` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apiUrl` text COLLATE utf8mb4_unicode_ci,
  `token` text COLLATE utf8mb4_unicode_ci,
  `siteId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `lastPushAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SEOPushConfig_platform_key` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SEOPushConfig`
--

LOCK TABLES `SEOPushConfig` WRITE;
/*!40000 ALTER TABLE `SEOPushConfig` DISABLE KEYS */;
/*!40000 ALTER TABLE `SEOPushConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SEOPushLog`
--

DROP TABLE IF EXISTS `SEOPushLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SEOPushLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `configId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `response` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `SEOPushLog_configId_fkey` (`configId`),
  CONSTRAINT `SEOPushLog_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `SEOPushConfig` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SEOPushLog`
--

LOCK TABLES `SEOPushLog` WRITE;
/*!40000 ALTER TABLE `SEOPushLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `SEOPushLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SEOSetting`
--

DROP TABLE IF EXISTS `SEOSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SEOSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keywords` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ogImage` text COLLATE utf8mb4_unicode_ci,
  `canonical` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `articleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SEOSetting_pageId_key` (`pageId`),
  UNIQUE KEY `SEOSetting_articleId_key` (`articleId`),
  CONSTRAINT `SEOSetting_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SEOSetting_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SEOSetting`
--

LOCK TABLES `SEOSetting` WRITE;
/*!40000 ALTER TABLE `SEOSetting` DISABLE KEYS */;
INSERT INTO `SEOSetting` VALUES ('3c5008f7-e9d0-477e-b670-f385aa9644b3',NULL,NULL,NULL,NULL,NULL,NULL,'317b0412-3e34-410b-a40b-89447776523c'),('42c39bca-970a-49b8-bd76-57d1a76ec14f',NULL,NULL,NULL,NULL,NULL,'100fdbac-18cf-4178-81dd-0c4ff0b3f800',NULL),('43d62ba2-0726-4a40-a064-14dee4d14511',NULL,NULL,NULL,NULL,NULL,'395d36bc-866f-403d-a919-21fd33bcd0a0',NULL),('76e03278-b36c-4994-93de-a9ff213a359f',NULL,NULL,NULL,NULL,NULL,NULL,'3ab5c9ee-6d12-4191-a922-0a1fd3120f53'),('7902efc5-602a-4d0e-bbe6-c150efa8b407','小程序开发指南：优势、步骤与平台选择','小程序开发,微信小程序,支付宝小程序,JavaScript,uni-app,Taro,移动应用开发,低成本开发','了解小程序开发的核心优势，包括低成本、快速传播和无需下载安装。探索微信、支付宝等平台的小程序开发步骤和最佳实践。',NULL,NULL,NULL,'395e268d-a6ae-45d2-98df-226364af50b6'),('bc93b13b-3ce6-4974-83db-370b19ff3d38',NULL,NULL,NULL,NULL,NULL,NULL,'d3e45349-ecee-4e42-9f39-cd15e8ba07a1'),('ceb75aef-a6d3-4eb2-ba29-fc606aa83f7f',NULL,NULL,NULL,NULL,NULL,'31cfdb9b-72de-44a4-9dc0-a27de0de6ac2',NULL),('e8abf675-563f-49a0-a942-6e867bcbfccd',NULL,NULL,NULL,NULL,NULL,NULL,'3a60cea2-cde6-422b-8700-f69763d3eeea');
/*!40000 ALTER TABLE `SEOSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteSettings`
--

DROP TABLE IF EXISTS `SiteSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteSettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `headerSections` json DEFAULT NULL,
  `footerSections` json DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `favicon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `siteName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2563eb',
  `secondaryColor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `copyright` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socialLinks` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteSettings`
--

LOCK TABLES `SiteSettings` WRITE;
/*!40000 ALTER TABLE `SiteSettings` DISABLE KEYS */;
INSERT INTO `SiteSettings` VALUES ('76461a0c-ed90-47d7-b634-0448192e5114','[{\"id\": \"5272d6ff-7aec-4ee6-b4db-ddd837d51ef7\", \"data\": {\"logoText\": \"TwoRow\", \"navItems\": [{\"link\": \"/\", \"label\": \"首页\"}, {\"link\": \"/products\", \"label\": \"产品\"}, {\"link\": \"/services\", \"label\": \"服务\"}, {\"link\": \"/cases\", \"label\": \"案例\"}, {\"link\": \"/about\", \"label\": \"关于\"}], \"ctaButtonLink\": \"/get-started\", \"ctaButtonText\": \"联系我们\", \"ctaButtonColor\": \"#2563eb\", \"ctaButtonTextColor\": \"#ffffff\"}, \"type\": \"header\", \"style\": {\"height\": \"h-auto\", \"layout\": \"stacked\", \"sticky\": \"sticky top-0\", \"textColor\": \"#1f2937\", \"backgroundColor\": \"#ffffff\"}}]','[]','/uploads/1ce14962-e0b7-4aa4-a797-39e6dd6caf2e-1767797003727-xmasrw.png','/uploads/2a9102be-b96f-43fd-84b9-d0443e371485-1767796807262-ok7250.png','moli企业官网','#2563eb',NULL,'','','','',NULL,'2026-01-05 17:48:36.756','2026-01-11 10:47:50.742');
/*!40000 ALTER TABLE `SiteSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StorageConfig`
--

DROP TABLE IF EXISTS `StorageConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StorageConfig` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '0',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `config` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `StorageConfig_provider_idx` (`provider`),
  KEY `StorageConfig_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StorageConfig`
--

LOCK TABLES `StorageConfig` WRITE;
/*!40000 ALTER TABLE `StorageConfig` DISABLE KEYS */;
INSERT INTO `StorageConfig` VALUES ('9901ddd1-eb8d-46ce-8a65-c1f076584775','本地存储','LOCAL',1,0,'{\"baseUrl\": \"/uploads\", \"uploadDir\": \"\"}','2026-01-11 08:13:21.314','2026-01-11 08:19:12.376');
/*!40000 ALTER TABLE `StorageConfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SystemSetting`
--

DROP TABLE IF EXISTS `SystemSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SystemSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SystemSetting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SystemSetting`
--

LOCK TABLES `SystemSetting` WRITE;
/*!40000 ALTER TABLE `SystemSetting` DISABLE KEYS */;
INSERT INTO `SystemSetting` VALUES ('139cdd31-2a03-4b73-a4d8-e2d0c7b5bcdf','geo_settings','{\"crawlerConfig\":{\"GPTBot\":\"allow\",\"OAI-SearchBot\":\"allow\",\"Google-Extended\":\"allow\",\"anthropic-ai\":\"allow\",\"PerplexityBot\":\"allow\",\"CCBot\":\"allow\",\"Amazonbot\":\"allow\",\"FacebookBot\":\"allow\",\"Bingbot\":\"allow\",\"Applebot-Extended\":\"allow\",\"Bytespider\":\"allow\",\"Baiduspider\":\"allow\",\"Sogou-spider\":\"allow\",\"360Spider\":\"allow\",\"YisouSpider\":\"allow\",\"Alibaba-Agent\":\"allow\",\"TencentBot\":\"allow\",\"Moonshot-Bot\":\"allow\",\"DeepSeek-Bot\":\"allow\",\"Zhipu-Bot\":\"allow\",\"BaiChuan-Bot\":\"allow\",\"MiniMax-Bot\":\"allow\"},\"enableStructuredData\":true,\"enableEntityExtraction\":true,\"defaultSchemaOrg\":true,\"entityInfo\":{\"alternateName\":\"\",\"sameAs\":[]},\"googleOptimization\":{\"enabled\":true},\"bingOptimization\":{\"enabled\":true,\"indexNowEnabled\":true},\"amazonOptimization\":{\"enabled\":true,\"amazonbotAllowed\":true}}','GEO 优化设置（AI 爬虫控制、结构化数据等）'),('229d1a92-5b6a-4720-9e80-2574f89594b9','contact_address','','联系地址'),('312b3a66-0a10-49db-aa68-34deffba03af','copyright','','版权信息'),('47e2963c-177a-41ab-a1b8-5e6146f9bbcb','icp_number','蜀000001000','ICP 备案号'),('57fc6b8a-16ab-4887-a26a-88011d6fd3f9','enable_multi_language','true','是否开启多语言支持'),('62ebbe54-be75-4a9c-9ca3-32f1daf88809','show_author_card','true',''),('663b9bf1-207c-4f1f-ac97-10b151c87f1b','site_description','','网站描述'),('6a7101af-4ec5-4f54-8101-0abd49dfed0e','site_name','moli企业官网','网站名称'),('7fe5199b-09e8-4627-a3b3-ceab8531d2a6','contact_phone','','联系电话'),('882a13b1-d021-4e66-87d4-21b69b47bba1','site_icon','/uploads/2a9102be-b96f-43fd-84b9-d0443e371485-1767796807262-ok7250.png','网站图标 URL'),('89ba4022-0d07-4589-992e-29842b6346ac','i18n_settings','{\"enableMultiLanguage\":true,\"defaultLocale\":\"zh\",\"supportedLocales\":[\"zh\",\"en\",\"fr\",\"es\",\"ru\",\"ja\",\"ko\",\"de\"]}',''),('91eef12b-394b-4020-b569-8851273c372b','site_verification_files','[]',''),('9a27d6ca-2d9c-4cde-aafb-633d16370750','show_citations','true',''),('a8078b79-3685-4db0-9904-457df476360f','show_entities','true',''),('b376d5be-cff3-4337-b9ca-a0d42d29aabf','company_name','','公司名称'),('c74263d2-6cd0-4496-ae51-a4015824fe23','contact_email','','联系邮箱'),('cd0134ba-2181-46f1-bed7-3fee593a5f0a','site_logo','/uploads/1ce14962-e0b7-4aa4-a797-39e6dd6caf2e-1767797003727-xmasrw.png','网站 Logo URL'),('f2ad4a5f-6dcf-467e-ac6d-5886efae90da','site_url','','网站域名'),('f97880f6-78d6-42e9-a169-e98d867ac6ac','primaryColor','#2563eb','');
/*!40000 ALTER TABLE `SystemSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrendingTopic`
--

DROP TABLE IF EXISTS `TrendingTopic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TrendingTopic` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `queryCount` int(11) NOT NULL DEFAULT '0',
  `trendScore` double NOT NULL DEFAULT '0',
  `growthRate` double NOT NULL DEFAULT '0',
  `peakTime` datetime(3) DEFAULT NULL,
  `relatedTopics` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `firstSeenAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `lastSeenAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TrendingTopic_trendScore_idx` (`trendScore`),
  KEY `TrendingTopic_queryCount_idx` (`queryCount`),
  KEY `TrendingTopic_status_idx` (`status`),
  KEY `TrendingTopic_lastSeenAt_idx` (`lastSeenAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrendingTopic`
--

LOCK TABLES `TrendingTopic` WRITE;
/*!40000 ALTER TABLE `TrendingTopic` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrendingTopic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN','EDITOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `expertise` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPublicAuthor` tinyint(1) NOT NULL DEFAULT '0',
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('66459764-48bf-49f5-a066-d327ae7a05c9','admin@example.com','Admin','$2b$12$9GDDEeVqB61h0RhNfaHQRebmoGD9wda/FnnU87B4YDGgY.jg0rXCe','admin','ADMIN','2026-01-05 16:07:13.827','2026-01-08 16:46:08.405','/uploads/abdbe5e2-0eb2-410f-8e37-51ff4cfecabc-1767796536442-wlp3cc.png','互联网信息专家,领先的GEO优化开发商.,,','GEO,生成式引擎数据处理',NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_ArticleToTag`
--

DROP TABLE IF EXISTS `_ArticleToTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_ArticleToTag` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_ArticleToTag_AB_unique` (`A`,`B`),
  KEY `_ArticleToTag_B_index` (`B`),
  CONSTRAINT `_ArticleToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ArticleToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_ArticleToTag`
--

LOCK TABLES `_ArticleToTag` WRITE;
/*!40000 ALTER TABLE `_ArticleToTag` DISABLE KEYS */;
/*!40000 ALTER TABLE `_ArticleToTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cms'
--

--
-- Dumping routines for database 'cms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-12 22:55:43
