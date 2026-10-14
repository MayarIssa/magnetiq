import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.package.deleteMany();
  await prisma.offer.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        slug: "small-magnet",
        name: "Small Photo Magnet",
        type: "MAGNET_SMALL",
        description:
          "A 5x5cm custom photo magnet — upload any picture and we print it onto a durable fridge magnet. Perfect for gifting or collecting memories on your fridge.",
        price: 60,
        compareAtPrice: null,
        sampleImageUrl: "/samples/small-magnet.svg",
        sortOrder: 1,
      },
      {
        slug: "large-magnet",
        name: "Large Photo Magnet",
        type: "MAGNET_LARGE",
        description:
          "A 9x9cm custom photo magnet for bigger memories and more detail. Same durable glossy print, bigger canvas.",
        price: 120,
        compareAtPrice: 140,
        sampleImageUrl: "/samples/large-magnet.svg",
        sortOrder: 2,
      },
      {
        slug: "save-the-date-card",
        name: "Save the Date Card",
        type: "EVENT_CARD",
        description:
          "A printed Save the Date card with an embedded custom-photo magnet insert. Upload your photo and add your names & date.",
        price: 90,
        compareAtPrice: null,
        sampleImageUrl: "/samples/card-save-the-date.svg",
        sortOrder: 3,
      },
      {
        slug: "engagement-card",
        name: "Engagement Announcement Card",
        type: "EVENT_CARD",
        description:
          "Announce your engagement in style with a printed card featuring your custom photo magnet insert.",
        price: 90,
        compareAtPrice: null,
        sampleImageUrl: "/samples/card-engagement.svg",
        sortOrder: 4,
      },
      {
        slug: "proposal-card",
        name: "Welcome to Our Proposal Card",
        type: "EVENT_CARD",
        description:
          "A beautiful welcome card for your proposal event, with an embedded custom-photo magnet insert of the special moment.",
        price: 95,
        compareAtPrice: null,
        sampleImageUrl: "/samples/card-proposal.svg",
        sortOrder: 5,
      },
      {
        slug: "wedding-invitation-card",
        name: "Wedding Invitation Card",
        type: "EVENT_CARD",
        description:
          "An elegant wedding invitation card with an embedded custom-photo magnet insert of the couple.",
        price: 100,
        compareAtPrice: null,
        sampleImageUrl: "/samples/card-wedding.svg",
        sortOrder: 6,
      },
    ],
  });

  await prisma.package.createMany({
    data: [
      {
        slug: "set-of-5-small",
        name: "Set of 5 Small Magnets",
        description: "Five 5x5cm custom photo magnets — mix and match your favorite pictures. Great value bundle.",
        price: 250,
        compareAtPrice: 300,
        badge: "Save 50 EGP",
        composition: "5 x Small Magnets (5x5cm)",
        sampleImageUrl: "/samples/package-5-small.svg",
        photoSlots: 5,
        sortOrder: 1,
      },
      {
        slug: "family-pack-10",
        name: "Family Pack — 10 Magnets",
        description: "Ten small magnets to cover the whole fridge with memories. Our best-selling bundle.",
        price: 450,
        compareAtPrice: 600,
        badge: "Save 150 EGP",
        composition: "10 x Small Magnets (5x5cm)",
        sampleImageUrl: "/samples/package-10-small.svg",
        photoSlots: 10,
        sortOrder: 2,
      },
      {
        slug: "valentine-bundle",
        name: "Valentine Bundle",
        description: "Two large magnets plus one event card — the perfect romantic gift bundle.",
        price: 220,
        compareAtPrice: 330,
        badge: "-33% Valentine Sale",
        composition: "2 x Large Magnets + 1 x Event Card",
        sampleImageUrl: "/samples/package-valentine.svg",
        photoSlots: 3,
        sortOrder: 3,
      },
      {
        slug: "duo-large-magnets",
        name: "Duo Large Magnets",
        description: "Two large 9x9cm magnets bundled together at a better price.",
        price: 220,
        compareAtPrice: 240,
        badge: "Save 20 EGP",
        composition: "2 x Large Magnets (9x9cm)",
        sampleImageUrl: "/samples/package-duo-large.svg",
        photoSlots: 2,
        sortOrder: 4,
      },
    ],
  });

  await prisma.offer.createMany({
    data: [
      {
        title: "Valentine Sale — up to 50% off",
        description: "Turn your favorite moments into magnets and cards this Valentine season. Limited time offer on bundles.",
        badgeText: "-50%",
        active: true,
      },
      {
        title: "Free delivery over 300 EGP",
        description: "Spend 300 EGP or more and delivery is on us, anywhere in Egypt.",
        badgeText: "Free Delivery",
        active: true,
      },
    ],
  });

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "201234567890",
      deliveryFee: Number(process.env.DELIVERY_FEE || 50),
    },
  });

  // No credential defaults here on purpose: this file is committed, so a fallback
  // password would be a published admin login. Set both in .env instead.
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding. See .env.example."
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${email} / password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
