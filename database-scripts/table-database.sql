USE [master]
GO
/****** Object:  Database [final]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE DATABASE [final]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'final', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\final.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'final_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\final_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [final] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [final].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [final] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [final] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [final] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [final] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [final] SET ARITHABORT OFF 
GO
ALTER DATABASE [final] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [final] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [final] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [final] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [final] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [final] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [final] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [final] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [final] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [final] SET  DISABLE_BROKER 
GO
ALTER DATABASE [final] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [final] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [final] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [final] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [final] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [final] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [final] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [final] SET RECOVERY FULL 
GO
ALTER DATABASE [final] SET  MULTI_USER 
GO
ALTER DATABASE [final] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [final] SET DB_CHAINING OFF 
GO
ALTER DATABASE [final] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [final] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [final] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [final] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'final', N'ON'
GO
ALTER DATABASE [final] SET QUERY_STORE = ON
GO
ALTER DATABASE [final] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [final]
GO
/****** Object:  Table [dbo].[account]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account](
	[enabled] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[role_id] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[password] [varchar](255) NULL,
	[provider] [varchar](255) NULL,
	[social_id] [varchar](255) NULL,
	[status] [varchar](255) NULL,
	[username] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[address]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[address](
	[customer_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[is_default] [bit] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[detail] [nvarchar](255) NULL,
	[district] [nvarchar](255) NULL,
	[district_id] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[phone] [varchar](255) NULL,
	[province] [nvarchar](255) NULL,
	[province_id] [varchar](255) NULL,
	[ward] [nvarchar](255) NULL,
	[ward_id] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[brand]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[brand](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart](
	[customer_id] [int] NULL,
	[deleted] [bit] NULL,
	[delivery_fee] [float] NULL,
	[discount] [float] NULL,
	[district_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[province_id] [int] NULL,
	[sub_total] [float] NULL,
	[total] [float] NULL,
	[voucher_id] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[address] [nvarchar](255) NULL,
	[code] [varchar](255) NULL,
	[district_name] [nvarchar](255) NULL,
	[email] [nvarchar](255) NULL,
	[payment] [varchar](255) NULL,
	[phone] [nvarchar](255) NULL,
	[province_name] [nvarchar](255) NULL,
	[recipient_name] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
	[type] [varchar](255) NULL,
	[ward_id] [varchar](255) NULL,
	[ward_name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart_detail]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_detail](
	[cart_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_detail_id] [int] NULL,
	[quantity] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[collar]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[collar](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[color]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[color](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer](
	[account_id] [int] NULL,
	[birth_date] [date] NULL,
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[email] [nvarchar](255) NULL,
	[gender] [nvarchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[phone] [varchar](255) NULL,
	[status] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[elasticity]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[elasticity](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[event]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[event](
	[discount_percent] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quantity_discount] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[end_date] [datetime2](6) NULL,
	[start_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[discount_code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[event_product]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[event_product](
	[event_id] [int] NOT NULL,
	[product_id] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[history]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[history](
	[account_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[note] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[image]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[image](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[url] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[material]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[material](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_detail]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_detail](
	[average_discount_event] [float] NULL,
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[product_detail_id] [int] NULL,
	[quantity] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[customer_id] [int] NULL,
	[deleted] [bit] NULL,
	[delivery_fee] [float] NULL,
	[discount] [float] NULL,
	[discount_voucher_percent] [float] NULL,
	[district_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[in_store] [bit] NULL,
	[is_payment] [bit] NULL,
	[province_id] [nvarchar](255) NULL,
	[staff_id] [int] NULL,
	[sub_total] [float] NULL,
	[total] [float] NULL,
	[total_paid] [float] NULL,
	[voucher_id] [int] NULL,
	[voucher_minimum_subtotal_required] [float] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[address] [nvarchar](255) NULL,
	[code] [varchar](255) NULL,
	[district_name] [nvarchar](255) NULL,
	[email] [varchar](255) NULL,
	[payment] [varchar](255) NULL,
	[phone] [varchar](255) NULL,
	[province_name] [nvarchar](255) NULL,
	[recipient_name] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
	[type] [varchar](255) NULL,
	[ward_id] [varchar](255) NULL,
	[ward_name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[origin]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[origin](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[description] [nvarchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_detail]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_detail](
	[brand_id] [int] NULL,
	[collar_id] [int] NULL,
	[color_id] [int] NULL,
	[deleted] [bit] NULL,
	[elasticity_id] [int] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[mass] [int] NULL,
	[material_id] [int] NULL,
	[origin_id] [int] NULL,
	[price] [float] NULL,
	[product_id] [int] NULL,
	[quantity] [int] NULL,
	[size_id] [int] NULL,
	[sleeve_id] [int] NULL,
	[style_id] [int] NULL,
	[texture_id] [int] NULL,
	[thickness_id] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_detail_image]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_detail_image](
	[image_id] [int] NOT NULL,
	[product_detail_id] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[role]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[role](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[size]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[size](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sleeve]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sleeve](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[staff]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[staff](
	[account_id] [int] NULL,
	[birth_day] [date] NULL,
	[deleted] [bit] NULL,
	[gender] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[address] [nvarchar](255) NULL,
	[citizen_id] [varchar](255) NULL,
	[code] [varchar](255) NULL,
	[district] [nvarchar](255) NULL,
	[email] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[note] [nvarchar](255) NULL,
	[phone] [varchar](255) NULL,
	[province] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
	[ward] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[style]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[style](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[texture]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[texture](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[thickness]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[thickness](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tokens]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tokens](
	[account_id] [int] NULL,
	[expired] [bit] NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[is_mobile] [bit] NOT NULL,
	[revoked] [bit] NOT NULL,
	[created_date] [datetime2](6) NULL,
	[expiration_date] [datetime2](6) NOT NULL,
	[refresh_expiration_date] [datetime2](6) NOT NULL,
	[updated_date] [datetime2](6) NULL,
	[token_type] [varchar](50) NULL,
	[refresh_token] [varchar](255) NULL,
	[token] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher](
	[deleted] [bit] NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
	[max_percent] [int] NULL,
	[min_amount] [int] NULL,
	[quantity] [int] NULL,
	[created_date] [datetime2](6) NULL,
	[end_date] [datetime2](6) NULL,
	[start_date] [datetime2](6) NULL,
	[updated_date] [datetime2](6) NULL,
	[code] [varchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[status] [varchar](255) NULL,
	[type_ticket] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher_customer]    Script Date: 12/13/2024 8:44:21 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher_customer](
	[customer_id] [int] NOT NULL,
	[voucher_id] [int] NOT NULL
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKgex1lmaqpg0ir5g1f5eftyaa1]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKgex1lmaqpg0ir5g1f5eftyaa1] ON [dbo].[account]
(
	[username] ASC
)
WHERE ([username] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKg7ft8mes72rnsk746b7ibyln2]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKg7ft8mes72rnsk746b7ibyln2] ON [dbo].[brand]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKen0126g6bmglbwsbk87omyu7x]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKen0126g6bmglbwsbk87omyu7x] ON [dbo].[cart_detail]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKmkxgqkhj5ndjpv1nvcfxdf7t3]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKmkxgqkhj5ndjpv1nvcfxdf7t3] ON [dbo].[collar]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKcbnc5ktj6whhh690w32k8cyh8]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKcbnc5ktj6whhh690w32k8cyh8] ON [dbo].[color]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKiw1xq6t67p4p17gr2d5dcrar1]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKiw1xq6t67p4p17gr2d5dcrar1] ON [dbo].[customer]
(
	[code] ASC,
	[email] ASC,
	[phone] ASC
)
WHERE ([code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UKjwt2qo9oj3wd7ribjkymryp8s]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKjwt2qo9oj3wd7ribjkymryp8s] ON [dbo].[customer]
(
	[account_id] ASC
)
WHERE ([account_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK8padggflv5sxp2u68ty11hx91]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UK8padggflv5sxp2u68ty11hx91] ON [dbo].[elasticity]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKgenmj627lt9fwmu97wf974o44]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKgenmj627lt9fwmu97wf974o44] ON [dbo].[event]
(
	[discount_code] ASC
)
WHERE ([discount_code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKf8554665e4e0t819jc07asw22]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKf8554665e4e0t819jc07asw22] ON [dbo].[image]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKt9kjl2b3iqg9sv9xe06fcxcya]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKt9kjl2b3iqg9sv9xe06fcxcya] ON [dbo].[material]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKgt3o4a5bqj59e9y6wakgk926t]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKgt3o4a5bqj59e9y6wakgk926t] ON [dbo].[orders]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK7e5g3f1j7w3jfye6tninigdro]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UK7e5g3f1j7w3jfye6tninigdro] ON [dbo].[origin]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKh3w5r1mx6d0e5c6um32dgyjej]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKh3w5r1mx6d0e5c6um32dgyjej] ON [dbo].[product]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKndx952w0v9kxawibxhciotx1w]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKndx952w0v9kxawibxhciotx1w] ON [dbo].[product_detail]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKc36say97xydpmgigg38qv5l2p]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKc36say97xydpmgigg38qv5l2p] ON [dbo].[role]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UK2cl2qxxrob1p3d291xr99no9j]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UK2cl2qxxrob1p3d291xr99no9j] ON [dbo].[size]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKxeixx6xuy44keusgk80bicdd]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKxeixx6xuy44keusgk80bicdd] ON [dbo].[sleeve]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UK4uqyb8awsv3mfncjj737o7oo9]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UK4uqyb8awsv3mfncjj737o7oo9] ON [dbo].[staff]
(
	[account_id] ASC
)
WHERE ([account_id] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKr4h7xlxecyyylk0xdc7u0f7lf]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKr4h7xlxecyyylk0xdc7u0f7lf] ON [dbo].[staff]
(
	[code] ASC,
	[email] ASC,
	[phone] ASC
)
WHERE ([code] IS NOT NULL AND [email] IS NOT NULL AND [phone] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKqiy003f5r7e6ey7l5y3apiu76]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKqiy003f5r7e6ey7l5y3apiu76] ON [dbo].[style]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKltw1388iiex1fh3yyexn8ll9s]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKltw1388iiex1fh3yyexn8ll9s] ON [dbo].[texture]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKnkdkv6j2y4egsd7j34hf0xbvt]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKnkdkv6j2y4egsd7j34hf0xbvt] ON [dbo].[thickness]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UKpvh1lqheshnjoekevvwla03xn]    Script Date: 12/13/2024 8:44:21 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UKpvh1lqheshnjoekevvwla03xn] ON [dbo].[voucher]
(
	[code] ASC
)
WHERE ([code] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[account]  WITH CHECK ADD  CONSTRAINT [FKd4vb66o896tay3yy52oqxr9w0] FOREIGN KEY([role_id])
REFERENCES [dbo].[role] ([id])
GO
ALTER TABLE [dbo].[account] CHECK CONSTRAINT [FKd4vb66o896tay3yy52oqxr9w0]
GO
ALTER TABLE [dbo].[address]  WITH CHECK ADD  CONSTRAINT [FK93c3js0e22ll1xlu21nvrhqgg] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
GO
ALTER TABLE [dbo].[address] CHECK CONSTRAINT [FK93c3js0e22ll1xlu21nvrhqgg]
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD  CONSTRAINT [FKc251mbx6hw7613vnknobredv2] FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[cart] CHECK CONSTRAINT [FKc251mbx6hw7613vnknobredv2]
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD  CONSTRAINT [FKdebwvad6pp1ekiqy5jtixqbaj] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
GO
ALTER TABLE [dbo].[cart] CHECK CONSTRAINT [FKdebwvad6pp1ekiqy5jtixqbaj]
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD  CONSTRAINT [FK3c8gudcdnngwh5k2g2n25kkqk] FOREIGN KEY([product_detail_id])
REFERENCES [dbo].[product_detail] ([id])
GO
ALTER TABLE [dbo].[cart_detail] CHECK CONSTRAINT [FK3c8gudcdnngwh5k2g2n25kkqk]
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD  CONSTRAINT [FKrg4yopd2252nwj8bfcgq5f4jp] FOREIGN KEY([cart_id])
REFERENCES [dbo].[cart] ([id])
GO
ALTER TABLE [dbo].[cart_detail] CHECK CONSTRAINT [FKrg4yopd2252nwj8bfcgq5f4jp]
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD  CONSTRAINT [FKn9x2k8svpxj3r328iy1rpur83] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[customer] CHECK CONSTRAINT [FKn9x2k8svpxj3r328iy1rpur83]
GO
ALTER TABLE [dbo].[event_product]  WITH CHECK ADD  CONSTRAINT [FK4ad8tyf4bpqr6h821jh42uqxl] FOREIGN KEY([event_id])
REFERENCES [dbo].[event] ([id])
GO
ALTER TABLE [dbo].[event_product] CHECK CONSTRAINT [FK4ad8tyf4bpqr6h821jh42uqxl]
GO
ALTER TABLE [dbo].[event_product]  WITH CHECK ADD  CONSTRAINT [FKntuxn8awf9tn7rxvximxbhb2x] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[event_product] CHECK CONSTRAINT [FKntuxn8awf9tn7rxvximxbhb2x]
GO
ALTER TABLE [dbo].[history]  WITH CHECK ADD  CONSTRAINT [FK2mpn4nxqqsu7euii4hwhbjeg8] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[history] CHECK CONSTRAINT [FK2mpn4nxqqsu7euii4hwhbjeg8]
GO
ALTER TABLE [dbo].[history]  WITH CHECK ADD  CONSTRAINT [FKh67g7uf13wwtr5ar270qti86f] FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[history] CHECK CONSTRAINT [FKh67g7uf13wwtr5ar270qti86f]
GO
ALTER TABLE [dbo].[order_detail]  WITH CHECK ADD  CONSTRAINT [FK4onmghajt9jh9quh6ed3lipdn] FOREIGN KEY([product_detail_id])
REFERENCES [dbo].[product_detail] ([id])
GO
ALTER TABLE [dbo].[order_detail] CHECK CONSTRAINT [FK4onmghajt9jh9quh6ed3lipdn]
GO
ALTER TABLE [dbo].[order_detail]  WITH CHECK ADD  CONSTRAINT [FKrws2q0si6oyd6il8gqe2aennc] FOREIGN KEY([order_id])
REFERENCES [dbo].[orders] ([id])
GO
ALTER TABLE [dbo].[order_detail] CHECK CONSTRAINT [FKrws2q0si6oyd6il8gqe2aennc]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK4ery255787xl56k025fyxrqe9] FOREIGN KEY([staff_id])
REFERENCES [dbo].[staff] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK4ery255787xl56k025fyxrqe9]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK624gtjin3po807j3vix093tlf] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK624gtjin3po807j3vix093tlf]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FKrx5vk9ur428660yp19hw98nr2] FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FKrx5vk9ur428660yp19hw98nr2]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FK56s4hqmp09omp2w84hijq3jyc] FOREIGN KEY([style_id])
REFERENCES [dbo].[style] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FK56s4hqmp09omp2w84hijq3jyc]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FK99vj2np1gk1robp8n6htiweii] FOREIGN KEY([color_id])
REFERENCES [dbo].[color] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FK99vj2np1gk1robp8n6htiweii]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKaulbngl3gskh8tll54wyh5ckg] FOREIGN KEY([sleeve_id])
REFERENCES [dbo].[sleeve] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKaulbngl3gskh8tll54wyh5ckg]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKcum8u2vfvebmmc4xo8de3k35s] FOREIGN KEY([size_id])
REFERENCES [dbo].[size] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKcum8u2vfvebmmc4xo8de3k35s]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKebv5c5kn3d3sxjjken6xm8ewa] FOREIGN KEY([elasticity_id])
REFERENCES [dbo].[elasticity] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKebv5c5kn3d3sxjjken6xm8ewa]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKelrbk54wt31vv07h3us1gap2c] FOREIGN KEY([material_id])
REFERENCES [dbo].[material] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKelrbk54wt31vv07h3us1gap2c]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKilxoi77ctyin6jn9robktb16c] FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKilxoi77ctyin6jn9robktb16c]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKkk0ba59xpfjat6ceh4fms3ljw] FOREIGN KEY([texture_id])
REFERENCES [dbo].[texture] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKkk0ba59xpfjat6ceh4fms3ljw]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKn29xx33y0vxapbc6ntf4kldxr] FOREIGN KEY([brand_id])
REFERENCES [dbo].[brand] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKn29xx33y0vxapbc6ntf4kldxr]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKnb3b3wpn7hlkbs5o6vhonn46c] FOREIGN KEY([origin_id])
REFERENCES [dbo].[origin] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKnb3b3wpn7hlkbs5o6vhonn46c]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKo97vo0ox06s9fp5dxh6dq2san] FOREIGN KEY([thickness_id])
REFERENCES [dbo].[thickness] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKo97vo0ox06s9fp5dxh6dq2san]
GO
ALTER TABLE [dbo].[product_detail]  WITH CHECK ADD  CONSTRAINT [FKrs2l68eovv4jbptsnrw9xxk29] FOREIGN KEY([collar_id])
REFERENCES [dbo].[collar] ([id])
GO
ALTER TABLE [dbo].[product_detail] CHECK CONSTRAINT [FKrs2l68eovv4jbptsnrw9xxk29]
GO
ALTER TABLE [dbo].[product_detail_image]  WITH CHECK ADD  CONSTRAINT [FK6lmrllls0dulie6lcmcmben99] FOREIGN KEY([image_id])
REFERENCES [dbo].[image] ([id])
GO
ALTER TABLE [dbo].[product_detail_image] CHECK CONSTRAINT [FK6lmrllls0dulie6lcmcmben99]
GO
ALTER TABLE [dbo].[product_detail_image]  WITH CHECK ADD  CONSTRAINT [FKskyg70b8gibcihqttosjjsihb] FOREIGN KEY([product_detail_id])
REFERENCES [dbo].[product_detail] ([id])
GO
ALTER TABLE [dbo].[product_detail_image] CHECK CONSTRAINT [FKskyg70b8gibcihqttosjjsihb]
GO
ALTER TABLE [dbo].[staff]  WITH CHECK ADD  CONSTRAINT [FKs9jl798sgmtrl79dm4svocvaw] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[staff] CHECK CONSTRAINT [FKs9jl798sgmtrl79dm4svocvaw]
GO
ALTER TABLE [dbo].[tokens]  WITH CHECK ADD  CONSTRAINT [FKt48bf1bs3xikgfg8wtyajf9wj] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[tokens] CHECK CONSTRAINT [FKt48bf1bs3xikgfg8wtyajf9wj]
GO
ALTER TABLE [dbo].[voucher_customer]  WITH CHECK ADD  CONSTRAINT [FK1x9wxfsp0n58p1394phab9uko] FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[voucher_customer] CHECK CONSTRAINT [FK1x9wxfsp0n58p1394phab9uko]
GO
ALTER TABLE [dbo].[voucher_customer]  WITH CHECK ADD  CONSTRAINT [FK4v69n165aqbdx77mwtikkmbfq] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([id])
GO
ALTER TABLE [dbo].[voucher_customer] CHECK CONSTRAINT [FK4v69n165aqbdx77mwtikkmbfq]
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD CHECK  (([payment]='TRANSFER' OR [payment]='CASH'))
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD CHECK  (([status]='PENDING' OR [status]='TOSHIP' OR [status]='SUCCESS'))
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD CHECK  (([type]='INSTORE' OR [type]='ONLINE'))
GO
ALTER TABLE [dbo].[history]  WITH CHECK ADD CHECK  (([status]='CANCELED' OR [status]='DELIVERED' OR [status]='TORECEIVE' OR [status]='TOSHIP' OR [status]='PENDING'))
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([payment]='TRANSFER' OR [payment]='CASH'))
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([status]='CANCELED' OR [status]='DELIVERED' OR [status]='TORECEIVE' OR [status]='TOSHIP' OR [status]='PENDING'))
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD CHECK  (([type]='INSTORE' OR [type]='ONLINE'))
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD CHECK  (([type_ticket]='Everybody' OR [type_ticket]='Individual'))
GO
USE [master]
GO
ALTER DATABASE [final] SET  READ_WRITE 
GO
