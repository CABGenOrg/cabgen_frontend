import MicroreactWarning from "@/components/Dashboard/MicroreactWarning";

const microreactURL = process.env.MICROREACT_URL || "";

const MicroreactDashboard = () => {
  return (
    <>
      <MicroreactWarning />
      <iframe
        src={microreactURL}
        width="100%"
        height="100%"
        className="w-[95vw] h-[180vh] border-none p-0 m-0"
        title="Genomic Network Data on Microreact"
        loading="lazy"
        allowFullScreen
      ></iframe>
    </>
  );
};

export default MicroreactDashboard;
