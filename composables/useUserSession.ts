const user = ref({ bestScore: 0 });

export function useUserSession() {
  return {
    user,
  };
}
