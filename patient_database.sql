-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS patient_healthcare_system;
USE patient_healthcare_system;

-- جدول المرضى (Patients)
CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('ذكر', 'أنثى', 'آخر') NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    insurance_company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستشفيات (Hospitals)
CREATE TABLE hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- إدخال بيانات المستشفيات في منطقة 6 أكتوبر
INSERT INTO hospitals (name, address, phone, email, latitude, longitude) VALUES
('مستشفى دار الفؤاد', '6 أكتوبر، الجيزة، مصر', '+20238247247', 'info@daralfouad.com', 29.9726, 30.9433),
('مستشفى سعد كفافي الجامعي', '6 أكتوبر، الجيزة، مصر', '+20238362483', 'info@skuh.org', 29.9662, 30.9333),
('مستشفى الحصري', '6 أكتوبر، الجيزة، مصر', '+20238363623', 'info@elhosary.com', 29.9747, 30.9397);

-- جدول الأطباء (Doctors)
CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    hospital_id INT,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);

-- إدخال بيانات عينة للأطباء
INSERT INTO doctors (first_name, last_name, specialty, hospital_id, email, phone) VALUES
('أحمد', 'محمد', 'قلب وأوعية دموية', 1, 'ahmed.mohamed@daralfouad.com', '+201234567890'),
('فاطمة', 'علي', 'أمراض باطنة', 2, 'fatma.ali@skuh.org', '+201098765432'),
('محمود', 'حسن', 'جراحة عامة', 3, 'mahmoud.hassan@elhosary.com', '+201112223344');

-- جدول المواعيد (Appointments)
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    appointment_date DATETIME NOT NULL,
    status ENUM('مجدول', 'مكتمل', 'ملغي') DEFAULT 'مجدول',
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

-- جدول الإشعارات (Notifications)
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    type ENUM('موعد', 'نتيجة فحص', 'تذكير دواء') NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

-- إنشاء مستخدم وإعطاء الصلاحيات
CREATE USER 'healthcare_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON patient_healthcare_system.* TO 'healthcare_user'@'localhost';
FLUSH PRIVILEGES;

