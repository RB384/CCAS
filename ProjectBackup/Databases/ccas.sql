-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2019 at 11:42 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ccas`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_mapping`
--

CREATE TABLE `activity_mapping` (
  `Activity_ID` int(11) NOT NULL,
  `Activity_Type` varchar(20) NOT NULL,
  `SID` int(11) NOT NULL,
  `Achievement_Type` varchar(15) NOT NULL,
  `Marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `award_distribution`
--

CREATE TABLE `award_distribution` (
  `Max_IC_Technical` int(11) NOT NULL,
  `Max_IC_Cultural` int(11) NOT NULL,
  `COA_times` int(11) NOT NULL,
  `COE_times` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `award_distribution`
--

INSERT INTO `award_distribution` (`Max_IC_Technical`, `Max_IC_Cultural`, `COA_times`, `COE_times`) VALUES
(6, 6, 9, 4);

-- --------------------------------------------------------

--
-- Table structure for table `coa_award`
--

CREATE TABLE `coa_award` (
  `Year` varchar(8) NOT NULL,
  `SID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Society_Associated` varchar(15) NOT NULL,
  `P_Marks` int(11) NOT NULL DEFAULT 0,
  `A_Marks` int(11) NOT NULL DEFAULT 0,
  `O_Marks` int(11) NOT NULL DEFAULT 0,
  `Total_Marks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `coe_award`
--

CREATE TABLE `coe_award` (
  `Year` varchar(10) NOT NULL,
  `SID` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Society_Associated` varchar(10) NOT NULL,
  `P_Marks` int(11) NOT NULL DEFAULT 0,
  `A_Marks` int(11) NOT NULL DEFAULT 0,
  `O_Marks` int(11) NOT NULL DEFAULT 0,
  `Total_Marks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `eligibilty`
--

CREATE TABLE `eligibilty` (
  `IC` int(11) NOT NULL,
  `COA` int(11) NOT NULL,
  `COE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `eligibilty`
--

INSERT INTO `eligibilty` (`IC`, `COA`, `COE`) VALUES
(8, 6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `eligible_students`
--

CREATE TABLE `eligible_students` (
  `Societyname` varchar(10) NOT NULL,
  `COA` int(11) NOT NULL,
  `COE` int(11) NOT NULL,
  `IC` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `event_details`
--

CREATE TABLE `event_details` (
  `Event_ID` int(11) NOT NULL,
  `Society_Name` varchar(30) NOT NULL,
  `Event_Name` varchar(40) NOT NULL,
  `Event_Location` varchar(50) NOT NULL,
  `Event_Date` date NOT NULL,
  `Event_Sponsor` varchar(250) NOT NULL,
  `Event_Type` varchar(50) NOT NULL,
  `Participation_Count` int(11) NOT NULL,
  `P_Certification` int(11) NOT NULL,
  `A_Certification` int(11) NOT NULL,
  `O_Certification` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ic_award`
--

CREATE TABLE `ic_award` (
  `Year` varchar(10) NOT NULL,
  `SID` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Society_Associated` varchar(15) NOT NULL,
  `P_Marks` int(11) NOT NULL DEFAULT 0,
  `A_Marks` int(11) NOT NULL DEFAULT 0,
  `O_Marks` int(11) NOT NULL DEFAULT 0,
  `Total_Marks` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_details`
--

CREATE TABLE `login_details` (
  `username` varchar(25) NOT NULL,
  `password` varchar(50) NOT NULL,
  `interface` varchar(20) NOT NULL,
  `Societyname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login_details`
--

INSERT INTO `login_details` (`username`, `password`, `interface`, `Societyname`) VALUES
('17103027', 'c4a41df7d1d207a2adcc45271904509f', 'Student', 'NotApplicable'),
('17103032', 'd39599832e44cf9b90e932bd5b6b9e2f', 'Student', 'NotApplicable'),
('17103033', '5852153c1c3208414163d40e660ed852', 'Student', 'NotApplicable'),
('17103063', '2a602e5cc771c61808b83621dabd7b62', 'Student', 'NotApplicable'),
('CollegeAdmin@A1', '90cd1302d245cb678e01dfbc993dd9ad', 'CollegeAdmin', 'NotApplicable'),
('CollegeAdmin@A2', 'fdac0ca98d111ee1818aa09bc9c745d4', 'CollegeAdmin', 'NotApplicable'),
('SocietyHead@ACM_CSS', '0d8f980802951b40c8fa9e3d5de6d587', 'SocietyHead', 'ACM_CSS'),
('SocietyHead@ATS', '600d2c32c47d0285e1df97492ed3bd35', 'SocietyHead', 'ATS'),
('SocietyHead@IEEE', '472abfae8142fdb6f39d081303e8af85', 'SocietyHead', 'IEEE'),
('SocietyHead@ROBOTICS', '345004550a625dacc10c7674e918b5f3', 'SocietyHead', 'RE');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `SID` int(11) NOT NULL,
  `Societyname` varchar(10) NOT NULL,
  `P1` int(11) NOT NULL DEFAULT 0,
  `A1` int(11) NOT NULL DEFAULT 0,
  `O1` int(11) NOT NULL DEFAULT 0,
  `P2` int(11) NOT NULL DEFAULT 0,
  `A2` int(11) NOT NULL DEFAULT 0,
  `O2` int(11) NOT NULL DEFAULT 0,
  `P3` int(11) NOT NULL DEFAULT 0,
  `A3` int(11) NOT NULL DEFAULT 0,
  `O3` int(11) DEFAULT 0,
  `P4` int(11) NOT NULL DEFAULT 0,
  `A4` int(11) NOT NULL DEFAULT 0,
  `O4` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `organizing_marks`
--

CREATE TABLE `organizing_marks` (
  `Lt250` int(11) NOT NULL,
  `Gt250` int(11) NOT NULL,
  `Max_Organizers` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `organizing_marks`
--

INSERT INTO `organizing_marks` (`Lt250`, `Gt250`, `Max_Organizers`) VALUES
(2, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `participation_marks`
--

CREATE TABLE `participation_marks` (
  `PEC_Participation` int(11) NOT NULL,
  `PEC_Award` int(11) NOT NULL,
  `Pr_Participation` int(11) NOT NULL,
  `Pr_Award` int(11) NOT NULL,
  `Int_Participation` int(11) NOT NULL,
  `Int_Award` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `participation_marks`
--

INSERT INTO `participation_marks` (`PEC_Participation`, `PEC_Award`, `Pr_Participation`, `Pr_Award`, `Int_Participation`, `Int_Award`) VALUES
(1, 2, 3, 6, 6, 8);

-- --------------------------------------------------------

--
-- Table structure for table `pending_requests`
--

CREATE TABLE `pending_requests` (
  `SID` int(11) NOT NULL,
  `Event_Name` varchar(20) NOT NULL,
  `Event_Location` varchar(30) NOT NULL,
  `Event_Date` date NOT NULL,
  `Achievement_Type` varchar(30) NOT NULL,
  `Institute_Type` varchar(30) NOT NULL,
  `Society_Associated` varchar(15) NOT NULL,
  `Certificate_URL` varchar(100) NOT NULL,
  `Request_Status` varchar(20) NOT NULL DEFAULT 'Pending',
  `Request_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `SID` int(11) NOT NULL,
  `UG_PG` varchar(25) NOT NULL,
  `Branch` varchar(30) NOT NULL,
  `Year` varchar(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `Mobile` bigint(20) NOT NULL,
  `CGPA` float NOT NULL,
  `backlog` varchar(3) NOT NULL,
  `disciplinary` varchar(3) NOT NULL,
  `father_name` varchar(25) NOT NULL,
  `address` text NOT NULL,
  `COA_Status` tinyint(1) NOT NULL DEFAULT 0,
  `COE_Status` tinyint(1) NOT NULL DEFAULT 0,
  `IC_Status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`SID`, `UG_PG`, `Branch`, `Year`, `name`, `email`, `Mobile`, `CGPA`, `backlog`, `disciplinary`, `father_name`, `address`, `COA_Status`, `COE_Status`, `IC_Status`) VALUES
(17103027, 'Undergraduate', 'CSE', 'Third', 'Raghav Bansal', 'bansalraghav384@gmail.com', 9877337197, 9.94, 'No', 'No', 'Kapil Bansal', 'Hno 3311/1B Gurcharan Park Ludhiana', 0, 0, 0),
(17103032, 'Undergraduate', 'CSE', 'Third', 'Surjeet Kumar', 'lohansurjeet@gmail.com', 9872222173, 9, 'No', 'No', 'Jagbir Singh', '3681 Urban Estate', 0, 0, 0),
(17103033, 'Undergraduate', 'CSE', 'Third', 'Puneet Kapoor', 'puneetkapoor1212@gmail.com', 7984561234, 8.5, 'No', 'No', 'Tarun Kapoor', 'Hno 152 Sector 5 Panchkula', 0, 0, 0),
(17103063, 'Undergraduate', 'CSE', 'Third', 'Jatinder Singh', 'jatindersingh15@gmail.com', 7986417843, 7.5, 'No', 'No', 'Paramjit Singh', 'VPO Hoshirpaur', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `workshop_details`
--

CREATE TABLE `workshop_details` (
  `Workshop_ID` int(9) NOT NULL,
  `Society_Name` varchar(40) NOT NULL,
  `Workshop_Name` varchar(40) NOT NULL,
  `Workshop_Location` varchar(50) NOT NULL,
  `Workshop_Date` date NOT NULL,
  `Workshop_Sponsors` varchar(200) NOT NULL,
  `Workshop_Type` varchar(50) NOT NULL,
  `Participation_Count` int(11) NOT NULL,
  `P_Certification` int(11) NOT NULL,
  `O_Certification` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_mapping`
--
ALTER TABLE `activity_mapping`
  ADD PRIMARY KEY (`Activity_ID`,`SID`,`Achievement_Type`);

--
-- Indexes for table `award_distribution`
--
ALTER TABLE `award_distribution`
  ADD UNIQUE KEY `Max_IC_Technical` (`Max_IC_Technical`);

--
-- Indexes for table `coa_award`
--
ALTER TABLE `coa_award`
  ADD PRIMARY KEY (`SID`,`Society_Associated`);

--
-- Indexes for table `coe_award`
--
ALTER TABLE `coe_award`
  ADD PRIMARY KEY (`SID`,`Society_Associated`);

--
-- Indexes for table `eligible_students`
--
ALTER TABLE `eligible_students`
  ADD PRIMARY KEY (`Societyname`);

--
-- Indexes for table `event_details`
--
ALTER TABLE `event_details`
  ADD PRIMARY KEY (`Event_ID`);

--
-- Indexes for table `ic_award`
--
ALTER TABLE `ic_award`
  ADD PRIMARY KEY (`SID`,`Society_Associated`);

--
-- Indexes for table `login_details`
--
ALTER TABLE `login_details`
  ADD PRIMARY KEY (`username`,`password`,`interface`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`SID`,`Societyname`);

--
-- Indexes for table `participation_marks`
--
ALTER TABLE `participation_marks`
  ADD UNIQUE KEY `PEC_Participation` (`PEC_Participation`);

--
-- Indexes for table `pending_requests`
--
ALTER TABLE `pending_requests`
  ADD PRIMARY KEY (`Request_ID`);

--
-- Indexes for table `student_details`
--
ALTER TABLE `student_details`
  ADD PRIMARY KEY (`SID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `Mobile` (`Mobile`);

--
-- Indexes for table `workshop_details`
--
ALTER TABLE `workshop_details`
  ADD PRIMARY KEY (`Workshop_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event_details`
--
ALTER TABLE `event_details`
  MODIFY `Event_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120190001;

--
-- AUTO_INCREMENT for table `pending_requests`
--
ALTER TABLE `pending_requests`
  MODIFY `Request_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320190001;

--
-- AUTO_INCREMENT for table `workshop_details`
--
ALTER TABLE `workshop_details`
  MODIFY `Workshop_ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220190001;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
