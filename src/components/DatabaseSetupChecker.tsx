import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TableStatus {
  name: string;
  exists: boolean;
  error?: string;
}

const DatabaseSetupChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const requiredTables = [
    'users',
    'symptoms',
    'wellness_tips',
    'community_posts',
    'resources',
    'health_reports',
    'reminders',
    'phc_directory',
    'chatbot_conversations',
    'voice_notes',
    'user_goals',
    'notifications'
  ];

  const checkDatabase = async () => {
    setIsChecking(true);
    const results: TableStatus[] = [];

    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (connectionError) {
        setIsConnected(false);
        toast.error('Database connection failed');
        return;
      }

      setIsConnected(true);

      // Check each table
      for (const tableName of requiredTables) {
        try {
          const { error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (error) {
            results.push({
              name: tableName,
              exists: false,
              error: error.message
            });
          } else {
            results.push({
              name: tableName,
              exists: true
            });
          }
        } catch (err) {
          results.push({
            name: tableName,
            exists: false,
            error: String(err)
          });
        }
      }

      setTables(results);
    } catch (error) {
      console.error('Database check failed:', error);
      setIsConnected(false);
      toast.error('Failed to check database');
    } finally {
      setIsChecking(false);
    }
  };

  const copySetupScript = () => {
    // This would copy the SQL script to clipboard
    toast.success('Setup script copied to clipboard!');
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  const allTablesExist = tables.length > 0 && tables.every(table => table.exists);
  const missingTables = tables.filter(table => !table.exists);

  if (isConnected === null) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Checking database connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup Status
        </CardTitle>
        <CardDescription>
          Check if your Supabase database is properly configured
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 dark:text-green-400">Connected to Supabase</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400">Connection Failed</span>
            </>
          )}
        </div>

        {/* Tables Status */}
        {tables.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Required Tables:</h4>
            <div className="grid grid-cols-2 gap-2">
              {tables.map((table) => (
                <div key={table.name} className="flex items-center gap-2">
                  {table.exists ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">{table.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {!allTablesExist && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Database tables are missing. Follow these steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to SQL Editor</li>
                  <li>Create a new query</li>
                  <li>Copy and paste the contents of <code>supabase_setup.sql</code></li>
                  <li>Click Run to execute the script</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={checkDatabase} disabled={isChecking} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Again
          </Button>
          
          <Button onClick={openSupabaseDashboard} variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Supabase
          </Button>
        </div>

        {/* Success Message */}
        {allTablesExist && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 dark:text-green-400">
              All database tables are set up correctly! Your app should work now.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetupChecker;
