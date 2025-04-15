export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "closed-won":
      return "green";
    case "closed-lost":
      return "red";
    case "negotiation":
      return "blue";
    case "proposal":
      return "gold";
    case "qualified":
      return "cyan";
    case "prospecting":
      return "purple";
    default:
      return "default";
  }
};
