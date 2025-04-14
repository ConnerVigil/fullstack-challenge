const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        🎉 Welcome to the Fullstack Challenge! 🎉
      </h1>
      <p className="mb-4">
        Replace the content here with your own code and organize files as you
        see fit
      </p>
      <h2 className="text-2xl font-bold mb-2">Rules</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Spend no more than 4 hours working on the challenge</li>
        <li>Make use of any libraries and tools that you like </li>
        <li>
          Feel free to use help from LLMs but be prepared to explain your code
          and the choices you made
        </li>
        <li>Commit as you go. We want to see your thought process</li>
      </ul>
      <p>Good luck!</p>
    </div>
  );
};

export default Home;
