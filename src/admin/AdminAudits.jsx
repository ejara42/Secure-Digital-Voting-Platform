import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { listArchivedAudits, getAuditPresignedUrl } from '../api/api';

export default function AdminAudits() {
  const [items, setItems] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = async (continuationToken = null) => {
    setLoading(true);
    try {
      const params = { prefix: 'audits/', limit: 50 };
      if (continuationToken) params.continuationToken = continuationToken;
      const res = await listArchivedAudits(params);
      setItems(res.data.items || []);
      setNextToken(res.data.nextContinuationToken || null);
    } catch (err) {
      console.error('Failed to list audits', err);
      setItems([]);
      setNextToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDownload = async (key) => {
    try {
      const res = await getAuditPresignedUrl(key);
      const url = res.data.url;
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to get presigned url', err);
      alert('Failed to generate download link');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h3 className="text-xl font-semibold mb-4">Archived Audits</h3>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div>
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-2 py-1">Key</th>
                  <th className="px-2 py-1">Size</th>
                  <th className="px-2 py-1">Last Modified</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.key} className="border-t">
                    <td className="px-2 py-2 break-all">{it.key}</td>
                    <td className="px-2 py-2">{(it.size / 1024).toFixed(1)} KB</td>
                    <td className="px-2 py-2">{new Date(it.lastModified).toLocaleString()}</td>
                    <td className="px-2 py-2"><button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleDownload(it.key)}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => fetchList(null)} disabled={loading}>Refresh</button>
              {nextToken && <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => fetchList(nextToken)} disabled={loading}>Next</button>}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
