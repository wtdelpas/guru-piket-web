const fs = require('fs');

const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}

model Kelas {
  id        String   @id @default(cuid())
  nama      String   @unique
  siswa     Siswa[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Siswa {
  id            String          @id @default(cuid())
  nis           String          @unique
  nama          String
  kelasId       String
  kelas         Kelas           @relation(fields: [kelasId], references: [id])
  totalPoin     Int             @default(0)
  keterlambatan Keterlambatan[]
  pelanggaran   Pelanggaran[]
  prestasi      Prestasi[]
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}

model Keterlambatan {
  id        String   @id @default(cuid())
  siswaId   String
  siswa     Siswa    @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  tanggal   DateTime @default(now())
  alasan    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pelanggaran {
  id        String   @id @default(cuid())
  siswaId   String
  siswa     Siswa    @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  tanggal   DateTime @default(now())
  deskripsi String
  poin      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Prestasi {
  id        String   @id @default(cuid())
  siswaId   String
  siswa     Siswa    @relation(fields: [siswaId], references: [id], onDelete: Cascade)
  tanggal   DateTime @default(now())
  deskripsi String
  poin      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AturanTataTertib {
  id        String   @id @default(cuid())
  deskripsi String
  poin      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AturanPrestasi {
  id        String   @id @default(cuid())
  deskripsi String
  poin      Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  peran     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

fs.writeFileSync('prisma/schema.prisma', schema, 'utf8');
