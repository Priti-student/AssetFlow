import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:969296@localhost:5432/assetflow?schema=public';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetflow.com' },
    update: {},
    create: {
      email: 'admin@assetflow.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@assetflow.com' },
    update: {},
    create: {
      email: 'manager@assetflow.com',
      password: managerPassword,
      firstName: 'Asset',
      lastName: 'Manager',
      role: 'asset_manager',
      isActive: true,
    },
  });
  console.log('Created manager user:', manager.email);

  // Create employee user
  const empPassword = await bcrypt.hash('employee123', 12);
  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@assetflow.com' },
    update: {},
    create: {
      email: 'employee@assetflow.com',
      password: empPassword,
      firstName: 'John',
      lastName: 'Employee',
      role: 'employee',
      isActive: true,
    },
  });
  console.log('Created employee user:', employeeUser.email);

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'IT' },
      update: {},
      create: { name: 'Information Technology', code: 'IT', description: 'IT Department', isActive: true },
    }),
    prisma.department.upsert({
      where: { code: 'HR' },
      update: {},
      create: { name: 'Human Resources', code: 'HR', description: 'HR Department', isActive: true },
    }),
    prisma.department.upsert({
      where: { code: 'FIN' },
      update: {},
      create: { name: 'Finance', code: 'FIN', description: 'Finance Department', isActive: true },
    }),
    prisma.department.upsert({
      where: { code: 'OPS' },
      update: {},
      create: { name: 'Operations', code: 'OPS', description: 'Operations Department', isActive: true },
    }),
    prisma.department.upsert({
      where: { code: 'ADMIN' },
      update: {},
      create: { name: 'Administration', code: 'ADMIN', description: 'Administration Department', isActive: true },
    }),
  ]);
  console.log('Created departments');

  // Create employees linked to users and departments
  const adminEmp = await prisma.employee.upsert({
    where: { email: 'admin@assetflow.com' },
    update: {},
    create: {
      userId: admin.id,
      employeeCode: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@assetflow.com',
      role: 'admin',
      departmentId: departments[4].id,
      designation: 'System Administrator',
      joinDate: new Date('2024-01-01'),
      isActive: true,
    },
  });

  const managerEmp = await prisma.employee.upsert({
    where: { email: 'manager@assetflow.com' },
    update: {},
    create: {
      userId: manager.id,
      employeeCode: 'EMP002',
      firstName: 'Asset',
      lastName: 'Manager',
      email: 'manager@assetflow.com',
      role: 'asset_manager',
      departmentId: departments[0].id,
      designation: 'Asset Manager',
      joinDate: new Date('2024-01-15'),
      isActive: true,
    },
  });

  await prisma.employee.upsert({
    where: { email: 'employee@assetflow.com' },
    update: {},
    create: {
      userId: employeeUser.id,
      employeeCode: 'EMP003',
      firstName: 'John',
      lastName: 'Employee',
      email: 'employee@assetflow.com',
      role: 'employee',
      departmentId: departments[1].id,
      designation: 'HR Coordinator',
      joinDate: new Date('2024-02-01'),
      isActive: true,
    },
  });
  console.log('Created employees');

  // Create asset categories
  const categories = await Promise.all([
    prisma.assetCategory.upsert({
      where: { id: 'cat-electronics' },
      update: {},
      create: { id: 'cat-electronics', name: 'Electronics', description: 'Electronic devices and equipment', icon: 'monitor' },
    }),
    prisma.assetCategory.upsert({
      where: { id: 'cat-furniture' },
      update: {},
      create: { id: 'cat-furniture', name: 'Furniture', description: 'Office furniture', icon: 'armchair' },
    }),
    prisma.assetCategory.upsert({
      where: { id: 'cat-vehicles' },
      update: {},
      create: { id: 'cat-vehicles', name: 'Vehicles', description: 'Company vehicles', icon: 'car' },
    }),
    prisma.assetCategory.upsert({
      where: { id: 'cat-software' },
      update: {},
      create: { id: 'cat-software', name: 'Software', description: 'Software licenses', icon: 'code' },
    }),
  ]);

  // Create sub-categories
  await prisma.assetCategory.upsert({
    where: { id: 'cat-laptops' },
    update: {},
    create: { id: 'cat-laptops', name: 'Laptops', description: 'Laptop computers', icon: 'laptop', parentId: categories[0].id },
  });
  console.log('Created asset categories');

  // Create assets
  const assetsData = [
    { assetTag: 'AST-001', name: 'Dell XPS 15', categoryId: 'cat-laptops', serialNumber: 'SN-DELL-XPS-001', manufacturer: 'Dell', model: 'XPS 15 9530', purchaseDate: new Date('2024-01-15'), purchaseCost: 2499.99, warrantyStart: new Date('2024-01-15'), warrantyEnd: new Date('2027-01-15'), departmentId: departments[0].id, location: 'Floor 2 - IT Office', qrCode: 'QR-AST-001', barcode: 'BC-AST-001', condition: 'new', status: 'available', createdById: admin.id, updatedById: admin.id },
    { assetTag: 'AST-002', name: 'MacBook Pro 16', categoryId: 'cat-laptops', serialNumber: 'SN-MBP-002', manufacturer: 'Apple', model: 'MacBook Pro M3', purchaseDate: new Date('2024-02-01'), purchaseCost: 3499.00, warrantyStart: new Date('2024-02-01'), warrantyEnd: new Date('2027-02-01'), location: 'Floor 3 - Dev Team', qrCode: 'QR-AST-002', barcode: 'BC-AST-002', condition: 'new', status: 'allocated', departmentId: departments[0].id, createdById: admin.id, updatedById: admin.id },
    { assetTag: 'AST-003', name: 'HP LaserJet Pro', categoryId: 'cat-electronics', serialNumber: 'SN-HP-PRINT-003', manufacturer: 'HP', model: 'LaserJet Pro M404', purchaseDate: new Date('2024-03-01'), purchaseCost: 599.99, warrantyStart: new Date('2024-03-01'), warrantyEnd: new Date('2026-03-01'), departmentId: departments[4].id, location: 'Floor 1 - Reception', qrCode: 'QR-AST-003', barcode: 'BC-AST-003', condition: 'good', status: 'available', createdById: admin.id, updatedById: admin.id },
    { assetTag: 'AST-004', name: 'Office Desk - Standing', categoryId: 'cat-furniture', serialNumber: 'SN-DESK-004', manufacturer: 'IKEA', model: 'BEKANT', purchaseDate: new Date('2024-01-20'), purchaseCost: 450.00, warrantyStart: new Date('2024-01-20'), warrantyEnd: new Date('2029-01-20'), departmentId: departments[1].id, location: 'Floor 2 - HR', qrCode: 'QR-AST-004', barcode: 'BC-AST-004', condition: 'good', status: 'available', createdById: admin.id, updatedById: admin.id },
    { assetTag: 'AST-005', name: 'Toyota Camry 2024', categoryId: 'cat-vehicles', serialNumber: 'SN-TOYOTA-005', manufacturer: 'Toyota', model: 'Camry LE', purchaseDate: new Date('2024-04-01'), purchaseCost: 28500.00, warrantyStart: new Date('2024-04-01'), warrantyEnd: new Date('2027-04-01'), departmentId: departments[3].id, location: 'Parking Lot A', qrCode: 'QR-AST-005', barcode: 'BC-AST-005', condition: 'new', status: 'available', isSharedResource: true, createdById: admin.id, updatedById: admin.id },
    { assetTag: 'AST-006', name: 'Microsoft 365 Business', categoryId: 'cat-software', serialNumber: 'SN-MS365-006', manufacturer: 'Microsoft', model: 'Business Premium', purchaseDate: new Date('2024-01-01'), purchaseCost: 22.00, warrantyStart: new Date('2024-01-01'), warrantyEnd: new Date('2025-01-01'), departmentId: departments[0].id, location: 'Cloud', qrCode: 'QR-AST-006', barcode: 'BC-AST-006', condition: 'good', status: 'available', isSharedResource: true, createdById: admin.id, updatedById: admin.id },
  ];

  for (const assetData of assetsData) {
    await prisma.asset.upsert({
      where: { assetTag: assetData.assetTag },
      update: {},
      create: assetData,
    });
  }
  console.log('Created assets');

  // Create some allocations
  await prisma.allocation.create({
    data: {
      assetId: (await prisma.asset.findUnique({ where: { assetTag: 'AST-002' } }))!.id,
      employeeId: managerEmp.id,
      departmentId: departments[0].id,
      allocatedById: admin.id,
      status: 'active',
      allocatedAt: new Date('2024-02-01'),
    },
  });
  console.log('Created allocations');

  // Create some maintenance requests
  const asset3 = await prisma.asset.findUnique({ where: { assetTag: 'AST-003' } });
  if (asset3) {
    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset3.id,
        reportedById: adminEmp.id,
        title: 'Printer paper jam issue',
        description: 'Frequent paper jam issues reported by users',
        priority: 'medium',
        status: 'pending_approval',
        type: 'corrective',
      },
    });
  }
  console.log('Created maintenance requests');

  // Create an audit cycle
  await prisma.auditCycle.create({
    data: {
      title: 'Q1 2024 Asset Audit',
      description: 'Quarterly asset verification audit',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      status: 'scheduled',
      assignedAuditorId: adminEmp.id,
      totalAssets: 6,
    },
  });
  console.log('Created audit cycles');

  // Create activity logs
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: 'System initialized',
      entity: 'system',
      entityId: 'init',
      timestamp: new Date(),
    },
  });
  console.log('Created activity logs');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });