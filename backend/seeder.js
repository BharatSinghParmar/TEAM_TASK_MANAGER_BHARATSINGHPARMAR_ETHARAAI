import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Task.deleteMany();
    await Project.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const memberPassword = await bcrypt.hash('member123', salt);

    // Create Users
    const createdUsers = await User.insertMany([
      { name: 'Bharat', email: 'admin@taskmanager.com', password: adminPassword, role: 'Admin' },
      { name: 'Rahul', email: 'rahul@taskmanager.com', password: memberPassword, role: 'Member' },
      { name: 'Priya', email: 'priya@taskmanager.com', password: memberPassword, role: 'Member' },
    ]);

    const adminUser = createdUsers[0]._id;
    const rahulUser = createdUsers[1]._id;
    const priyaUser = createdUsers[2]._id;

    // Create Projects
    const createdProjects = await Project.insertMany([
      {
        name: 'SaaS Platform MVP',
        description: 'Core product development for our upcoming SaaS launch. Focus on dashboard, analytics, and RBAC components.',
        members: [adminUser, rahulUser, priyaUser],
        createdBy: adminUser,
      },
      {
        name: 'Marketing Campaign Q3',
        description: 'Assets, emails, and landing pages for the Q3 marketing push.',
        members: [adminUser, priyaUser],
        createdBy: adminUser,
      },
    ]);

    const project1 = createdProjects[0]._id;
    const project2 = createdProjects[1]._id;

    const now = new Date();
    const pastDate1 = new Date(now);
    pastDate1.setDate(now.getDate() - 3); // 3 days ago

    const pastDate2 = new Date(now);
    pastDate2.setDate(now.getDate() - 1); // 1 day ago

    const futureDate1 = new Date(now);
    futureDate1.setDate(now.getDate() + 5); // 5 days from now

    const futureDate2 = new Date(now);
    futureDate2.setDate(now.getDate() + 10); // 10 days from now

    // Create Tasks
    await Task.insertMany([
      {
        title: 'Design DB Schema',
        description: 'Finalize the MongoDB schema for projects and tasks.',
        status: 'Completed',
        dueDate: pastDate1,
        project: project1,
        assignedTo: rahulUser,
      },
      {
        title: 'Implement RBAC Auth',
        description: 'Create middleware to restrict routes for Admins and Members.',
        status: 'In Progress',
        dueDate: futureDate1,
        project: project1,
        assignedTo: priyaUser,
      },
      {
        title: 'Fix Navigation Bug (OVERDUE)',
        description: 'The mobile navigation drawer doesn’t close properly on iOS Safari.',
        status: 'In Progress',
        dueDate: pastDate2, // Overdue
        project: project1,
        assignedTo: rahulUser,
      },
      {
        title: 'Setup CI/CD Pipeline (OVERDUE)',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'Pending',
        dueDate: pastDate1, // Overdue
        project: project1,
        assignedTo: priyaUser,
      },
      {
        title: 'Draft Marketing Email Copy',
        description: 'Write the initial draft for the product announcement email.',
        status: 'Completed',
        dueDate: pastDate2,
        project: project2,
        assignedTo: priyaUser,
      },
      {
        title: 'Design Ad Creatives',
        description: 'Create 5 variations of banner ads for the campaign.',
        status: 'Pending',
        dueDate: futureDate2,
        project: project2,
        assignedTo: priyaUser,
      },
      {
        title: 'Review Landing Page Copy',
        description: 'Need final approval on the H1 and feature sections.',
        status: 'Pending',
        dueDate: futureDate1,
        project: project2,
        assignedTo: rahulUser, // Assigned to Rahul even though he is not officially a member of project2 in seed, wait let's assign to Priya or Admin
      }
    ]);

    // Fix task 7 assignee since Rahul is not in Project 2
    await Task.updateOne(
      { title: 'Review Landing Page Copy' },
      { $set: { assignedTo: adminUser } }
    );

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
