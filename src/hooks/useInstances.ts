
import { useState, useEffect } from 'react';
import { Instance } from '@/types';

const WEBHOOK_BASE_URL = 'https://n8n.andersonnunes.net/webhook';

export const useInstances = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${WEBHOOK_BASE_URL}/listarInstancias`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Falha ao carregar instâncias');
      
      const data = await response.json();
      setInstances(data.instances || []);
      
      // Seleciona a primeira instância ou a última usada
      const lastUsedId = localStorage.getItem('lastSelectedInstance');
      const instanceToSelect = lastUsedId 
        ? data.instances.find((i: Instance) => i.id === lastUsedId) || data.instances[0]
        : data.instances[0];
      
      if (instanceToSelect) {
        setSelectedInstance(instanceToSelect);
        await checkInstanceStatus(instanceToSelect.id);
      }
    } catch (err) {
      setError('Erro ao carregar instâncias');
      console.error('Erro ao buscar instâncias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkInstanceStatus = async (instanceId: string) => {
    try {
      const response = await fetch(`${WEBHOOK_BASE_URL}/statusWhatsapp?id=${instanceId}`);
      const data = await response.json();
      
      setInstances(prev => prev.map(instance => 
        instance.id === instanceId 
          ? { ...instance, status: data.status }
          : instance
      ));
      
      if (selectedInstance?.id === instanceId) {
        setSelectedInstance(prev => prev ? { ...prev, status: data.status } : null);
      }
    } catch (err) {
      console.error('Erro ao verificar status da instância:', err);
    }
  };

  const selectInstance = (instance: Instance) => {
    setSelectedInstance(instance);
    localStorage.setItem('lastSelectedInstance', instance.id);
    checkInstanceStatus(instance.id);
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return {
    instances,
    selectedInstance,
    isLoading,
    error,
    selectInstance,
    checkInstanceStatus,
    refreshInstances: fetchInstances
  };
};
