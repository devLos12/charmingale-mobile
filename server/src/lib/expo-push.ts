import { prisma } from "@/lib/prisma";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";





// idagdag sa taas nito (bago yung function):
const MOTIVATIONAL_MESSAGES = [
  "Hi Charm, it's time for review! 📚",
  "Let's go, future RN! 💪",
  "Your future patients are counting on you. Review time! 🩺",
  "One topic at a time, Charm. You've got this! ✨",
  "PNLE won't pass itself. Let's review! 📖",
  "Small steps today, big wins on exam day. 🎯",
  "Charm, your consistency is your superpower. Keep going! 🔥",
  "Take a break from scrolling, review for 10 mins instead 😉",
  "You didn't come this far to stop now. Review time! 🚀",
  "Future Nurse Charm is cheering you on. Let's study! 👩‍⚕️",
];

function getRandomMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}




export const sendHourlyReminder = async () => {

  const devices = await prisma.deviceToken.findMany();

  if (devices.length === 0) {
    console.log("No device tokens found, skipping push.");
    return;
  }

  const messages = devices.map((device) => ({
    to: device.token,
    sound: "default",
    title: "Charmingale",
    body: getRandomMessage(),
  }));
  
  

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log("Push sent:", data);

  } catch (error) {
    console.error("Failed to send push notifications:", error);
  }
};