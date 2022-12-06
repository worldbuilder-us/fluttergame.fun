import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import { useAPI } from "../../hooks/useAPI";
import { useTuning } from "../../context/TuningContext";

const Questions = () => {
  const { startTimestamp } = useTuning();
  let {
    data,
    error,
    refresh,
    loading: rankings_loading,
  } = useAPI(`/rankings?app=powmemes.com&type=meme&start_timestamp=${startTimestamp}`);

  let { data: recent, loading: recent_loading } = useAPI("/events?app=powmemes.com&type=meme");

  let rankings = data?.rankings;
  let boosted_tx = rankings?.map((q) => q.tx_id);
  let recent_memes = recent?.events;
  recent_memes = recent_memes?.filter(
    (q) => !boosted_tx?.includes(q.tx_id)
  );

  return (
    <Dashboard
      data={rankings}
      recent={recent_memes}
      error={error}
      loading={rankings_loading || recent_loading}
    />
  );
};

export default Questions;
