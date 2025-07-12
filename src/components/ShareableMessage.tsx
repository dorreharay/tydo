import React from 'react';
import dayjs from 'dayjs';
import { MessageSquareDashed } from 'lucide-react';

interface ShareableMessageProps {
  messageId: string;
  content: string;
  timestamp: Date;
  children: React.ReactNode;
}

export const ShareableMessage: React.FC<ShareableMessageProps> = ({
  messageId,
  content,
  timestamp,
  children,
}) => {
  return (
    <div
      id={`shareable-message-${messageId}`}
      className="bg-white border-none shareable-content dark:bg-stone-900"
      style={{
        // Inline styles for better export quality
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#1c1917',
        color: '#f5f5f4',
        padding: '48px',
        borderRadius: '16px',
        minWidth: '800px',
        maxWidth: '1200px',
        borderWidth: 0,
      }}
    >
      {/* Header with branding */}
      <div
        className="flex items-center justify-between mb-6 border-none"
        style={{
          paddingBottom: '24px',
          marginBottom: '32px',
        }}
      >
        <div className="flex items-center gap-3 border-none">
          <div
            className="p-2 border-none rounded-lg bg-stone-800"
            style={{
              backgroundColor: '#292524',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            <MessageSquareDashed className="w-5 h-5 border-none text-stone-300" />
          </div>
          <div className="border-none">
            <h3
              className="text-lg font-semibold border-none text-stone-100"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#f5f5f4',
                margin: 0,
              }}
            >
              Tydo Analytics
            </h3>
            <p
              className="text-sm border-none text-stone-400"
              style={{
                fontSize: '14px',
                color: '#a8a29e',
                margin: 0,
              }}
            >
              AI-Powered Business Intelligence
            </p>
          </div>
        </div>

        <div
          className="text-sm border-none text-stone-400"
          style={{
            fontSize: '14px',
            color: '#a8a29e',
          }}
        >
          {dayjs(timestamp).format('MMM D, YYYY • h:mm A')}
        </div>
      </div>

      {/* Message content */}
      <div
        className="mb-8 border-none"
        style={{
          marginBottom: '32px',
        }}
      >
        <p
          className="text-lg leading-relaxed border-none text-stone-200"
          style={{
            fontSize: '18px',
            lineHeight: '1.75',
            color: '#e7e5e4',
            margin: 0,
            marginBottom: '24px',
          }}
        >
          {content}
        </p>
      </div>

      {/* Chart area with subtle background */}
      <div
        className="p-6 border-none bg-stone-800/50 rounded-xl"
        style={{
          backgroundColor: 'rgba(41, 37, 36, 0.5)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ filter: 'none', transform: 'none' }}>{children}</div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-6 mt-8 border-none"
        style={{
          marginTop: '32px',
          paddingTop: '24px',
        }}
      >
        <p
          className="text-sm border-none text-stone-500"
          style={{
            fontSize: '14px',
            color: '#78716c',
            margin: 0,
          }}
        >
          Generated with Tydo • Your AI Business Assistant
        </p>
        <div
          className="text-sm border-none text-stone-500"
          style={{
            fontSize: '14px',
            color: '#78716c',
          }}
        >
          tydo.ai
        </div>
      </div>
    </div>
  );
};
