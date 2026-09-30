import { useCanvasStore } from '../canvasStore';

describe('canvasStore', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      nodes: {
        step1: {
          id: 'step1',
          label: 'Escopo',
          type: 'input',
          data: {},
          position: { x: 400, y: 50 },
          completed: false,
          locked: false,
        },
        step2: {
          id: 'step2',
          label: 'Paradigma',
          type: 'branching',
          data: {},
          position: { x: 400, y: 250 },
          completed: false,
          locked: true,
        },
        step2a: {
          id: 'step2a',
          label: 'Oceano',
          type: 'input',
          data: {},
          position: { x: 100, y: 450 },
          completed: false,
          locked: true,
        },
        step2b: {
          id: 'step2b',
          label: 'Conceito',
          type: 'input',
          data: {},
          position: { x: 700, y: 450 },
          completed: false,
          locked: true,
        },
        step3: {
          id: 'step3',
          label: 'Mercado',
          type: 'market',
          data: {},
          position: { x: 400, y: 650 },
          completed: false,
          locked: true,
        },
      },
      edges: [],
      unlockedNodes: ['step1'],
      completedNodes: [],
      paradigmChoice: null,
      dirty: false,
    });
  });

  it('should initialize with step1 unlocked', () => {
    const state = useCanvasStore.getState();
    expect(state.unlockedNodes).toContain('step1');
    expect(state.completedNodes).toHaveLength(0);
  });

  it('should complete a node and unlock the next', () => {
    const { completeNode } = useCanvasStore.getState();
    completeNode('step1', { content: 'Test scope' });

    const state = useCanvasStore.getState();
    expect(state.completedNodes).toContain('step1');
    expect(state.unlockedNodes).toContain('step2');
    expect(state.dirty).toBe(true);
  });

  it('should unlock multiple nodes for branching', () => {
    const { completeNode, setParadigmChoice } = useCanvasStore.getState();

    completeNode('step1', { content: 'Test scope' });
    setParadigmChoice('A');

    const state = useCanvasStore.getState();
    expect(state.paradigmChoice).toBe('A');
    // Step2 branching unlocks both step2a, step2b, and step3
    expect(state.unlockedNodes).toContain('step2');
  });

  it('should update node data without completing', () => {
    const { updateNodeData } = useCanvasStore.getState();
    updateNodeData('step3', { audience: 'Tech startups' });

    const state = useCanvasStore.getState();
    expect(state.nodes['step3'].data.audience).toBe('Tech startups');
    expect(state.completedNodes).not.toContain('step3');
  });

  it('should reset store', () => {
    const { completeNode, reset } = useCanvasStore.getState();
    completeNode('step1', { content: 'Test' });

    reset();

    const state = useCanvasStore.getState();
    expect(state.nodes).toEqual({});
    expect(state.unlockedNodes).toEqual(['step1']);
    expect(state.completedNodes).toEqual([]);
    expect(state.paradigmChoice).toBeNull();
  });

  it('should track dirty state on data changes', () => {
    const store = useCanvasStore.getState();
    expect(store.dirty).toBe(false);

    store.completeNode('step1', { content: 'Test' });
    expect(useCanvasStore.getState().dirty).toBe(true);

    store.setParadigmChoice('A');
    expect(useCanvasStore.getState().dirty).toBe(true);
  });
});
