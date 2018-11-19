// # 3rd Party Library
// If the library doesn't have typings available at `@types/`,
// you can still use it by manually adding typings for it
declare var module: NodeModule;
declare var $: any;
declare var jQuery: any;

interface NodeModule {
  id: string;
}
