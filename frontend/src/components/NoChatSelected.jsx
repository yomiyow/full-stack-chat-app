import { MessageSquare } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="relative">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
            <MessageSquare className="size-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
      <p className="text-base-content/60">
        Select a conversation from the sidebar to start chatting.
      </p>
    </div>
  );
};

export default NoChatSelected;
