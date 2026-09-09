CREATE TABLE Statuses (
    StatusID int IDENTITY(1,1) NOT NULL,
    StatusName nvarchar(50) NOT NULL,
    CONSTRAINT PK_Statuses PRIMARY KEY (StatusID),
    CONSTRAINT UQ_Statuses_StatusName UNIQUE (StatusName)
);

CREATE TABLE JobTypes (
    JobTypeID int IDENTITY(1,1) NOT NULL,
    JobType nvarchar(50) NOT NULL,
    CONSTRAINT PK_JobTypes PRIMARY KEY (JobTypeID),
    CONSTRAINT UQ_JobTypes_JobType UNIQUE (JobType)
);

CREATE TABLE Applications (
    ApplicationID int IDENTITY(1,1) NOT NULL,
    CompanyName nvarchar(150) NOT NULL,
    JobTitle nvarchar(200) NOT NULL,
    Location nvarchar(150) NULL,
    DateApplied date NOT NULL,
    StatusID int NOT NULL,
    JobTypeID int NOT NULL,
    Notes nvarchar(MAX) NULL,
    CreatedAt datetime2(7) NOT NULL DEFAULT (sysdatetime()),
    UpdatedAt datetime2(7) NOT NULL DEFAULT (sysdatetime()),
    CONSTRAINT PK_Applications PRIMARY KEY (ApplicationID),
    CONSTRAINT FK_Applications_Statuses
        FOREIGN KEY (StatusID) REFERENCES Statuses(StatusID),
    CONSTRAINT FK_Applications_JobTypes
        FOREIGN KEY (JobTypeID) REFERENCES JobTypes(JobTypeID)
);